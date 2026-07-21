import CloseModalFrame from "@/components/CloseModalFrame";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

export default function LocationModal({
  open,
  onClose,
  onSelect,
}: LocationModalProps) {
  if (!open) return null;

  return (
    <CloseModalFrame
      leftButtonText="나가기"
      rightButtonText="완료"
      onClose={onClose}
      onLeftButtonClick={onClose}
      onRightButtonClick={handleComplete}
    >
      {/* Category UI */}
    </CloseModalFrame>
  );
}