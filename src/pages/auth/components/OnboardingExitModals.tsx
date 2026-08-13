import OnboardCancelBox from "@/components/OnboardCancelBox";

export type OnboardingModal = "cancel" | "skip" | null;

interface OnboardingExitModalsProps {
  modal: OnboardingModal;
  isProfileOnboarding: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onQuit: () => void;
  onSkip: () => void;
}

export default function OnboardingExitModals({
  modal,
  isProfileOnboarding,
  isSubmitting,
  onClose,
  onQuit,
  onSkip,
}: OnboardingExitModalsProps) {
  if (!modal) return null;

  const isCancel = modal === "cancel";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
      <OnboardCancelBox
        title={
          isProfileOnboarding
            ? `맞춤 프로필 작성을 ${isCancel ? "중단" : "건너뛰"}시겠어요?`
            : `온보딩을 ${isCancel ? "중단" : "건너뛰"}시겠어요?`
        }
        description={
          isProfileOnboarding
            ? `기존에 저장된 맞춤 프로필 정보는 그대로 유지됩니다.\n현재 단계에서 작성 중인 내용은 저장되지 않습니다.`
            : isCancel
              ? `중단하면 지금까지 작성한 모든 온보딩 정보가 삭제됩니다.\n맞춤형 서비스 이용을 위한 기본 정보는 로그인 후\n[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`
              : `현재 단계에서 작성 중인 내용은 저장되지 않으며,\n이전 단계에서 저장한 정보는 그대로 유지됩니다.\n나머지 정보는 [마이페이지 > 설정]에서 언제든 작성할 수 있습니다.`
        }
        leftButtonText="계속하기"
        rightButtonText={
          isSubmitting
            ? "처리 중..."
            : isCancel
              ? "중단하기"
              : "건너뛰기"
        }
        className="z-[70]!"
        leftButtonDisabled={isSubmitting}
        rightButtonDisabled={isSubmitting}
        onLeftButtonClick={onClose}
        onRightButtonClick={isCancel ? onQuit : onSkip}
      />
    </div>
  );
}
