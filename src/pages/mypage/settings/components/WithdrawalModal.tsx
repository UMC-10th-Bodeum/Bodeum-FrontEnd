import { useEffect } from "react";
import OnboardCancelBox from "@/components/OnboardCancelBox";

interface WithdrawalModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawalModal({ onClose, onConfirm }: WithdrawalModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[40px] py-[44px]"
      onMouseDown={onClose}
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
          onRightButtonClick={onConfirm}
        />
      </div>
    </div>
  );
}
