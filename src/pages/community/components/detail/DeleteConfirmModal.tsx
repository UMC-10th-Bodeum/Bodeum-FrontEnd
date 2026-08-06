import OnboardCancelBox from "@/components/OnboardCancelBox";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
      <OnboardCancelBox
        title="게시글을 삭제하시겠어요?"
        description="삭제가 완료되면 고객님의 게시글이 즉시 삭제되며, 이는 복구할 수 없습니다."
        leftButtonText="취소"
        rightButtonText="삭제하기"
        className="z-[70]!"
        rightButtonColor="sub-red"
        onLeftButtonClick={onCancel}
        onRightButtonClick={onConfirm}
        leftButtonDisabled={false}
        rightButtonDisabled={loading}
      />
    </div>
  );
}
