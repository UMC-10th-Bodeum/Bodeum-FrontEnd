import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getApiErrorDetailMessage } from "@/apis/apiError";
import { clearAuthTokens } from "@/apis/authApi";
import { deleteMyAccount } from "@/apis/userApi";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";
import { clearAgreementBrowserSession } from "@/pages/auth/agreementBrowserSession";
import { clearAuthProgress } from "@/pages/auth/authProgressStorage";
import { clearOnboardingBrowserSession } from "@/pages/auth/onboardingBrowserSession";

interface WithdrawalModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawalModal({ onClose, onConfirm }: WithdrawalModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const handleConfirm = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await deleteMyAccount();

      if (!result.success) {
        throw new Error("회원 탈퇴 처리 결과를 확인할 수 없습니다.");
      }

      clearAuthTokens();
      clearAuthProgress();
      clearAgreementBrowserSession();
      clearOnboardingBrowserSession();
      queryClient.clear();
      onConfirm();
      showToast("green", "회원 탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (error) {
      setIsSubmitting(false);
      showToast(
        "red",
        getApiErrorDetailMessage(error, "회원 탈퇴에 실패했습니다."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[40px] py-[44px]"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div onMouseDown={(event) => event.stopPropagation()}>
        <OnboardCancelBox
          title="보듬에서 탈퇴하시겠어요?"
          description={`탈퇴가 완료되면 고객님의 계정 정보 및 이용 기록이 즉시 삭제되며,\n이는 복구할 수 없습니다.\n언제든 다시 찾아주세요. 탈퇴 처리를 진행할까요?`}
          leftButtonText="취소"
          rightButtonText="탈퇴하기"
          rightButtonColor="sub-red"
          className="!z-[70] !w-[581px]"
          onLeftButtonClick={onClose}
          onRightButtonClick={() => void handleConfirm()}
          leftButtonDisabled={isSubmitting}
          rightButtonDisabled={isSubmitting}
        />
      </div>
    </div>
  );
}
