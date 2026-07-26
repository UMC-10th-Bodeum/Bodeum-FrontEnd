import CloseModalFrame from "@/components/CloseModalFrame";

interface ReviewCancelModalProps {
  open: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

export default function ReviewCancelModal({
  open,
  onContinue,
  onCancel,
}: ReviewCancelModalProps) {
  if (!open) return null;

  return (
    <CloseModalFrame
      showCloseButton={false}
      onClose={onContinue}
      leftButtonText="이어쓰기"
      rightButtonText="중단하기"
      onLeftButtonClick={onContinue}
      onRightButtonClick={onCancel}
    >
      <div>
        <h2 className="text-h1-onboard text-background-600">
          후기 작성을 멈추시겠어요?
        </h2>

        <p className="mt-[28px] text-h2-onboard text-background-500">
          지금 종료하시면 작성 중이던 후기는 저장되지 않습니다.
        </p>
      </div>
    </CloseModalFrame>
  );
}