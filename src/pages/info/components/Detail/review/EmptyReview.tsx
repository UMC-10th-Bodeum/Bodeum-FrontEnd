import StarIcon from "@/assets/icons/StarEmpty.svg?react";
import ButtonFill from "@/components/button/ButtonFill";

interface Props {
  onWriteReview: () => void;
}

export default function EmptyReview({ onWriteReview }: Props) {
  return (
    <div className="flex flex-col items-center py-[16px]">
      <StarIcon className="text-main-200"/>

      <p className="mt-[6px] text-h4-list text-background-600">
        아직 후기가 없어요
      </p>

      <p className="mb-[16px] text-h6-list text-background-500">
        소중한 첫 경험담을 남겨주세요.
      </p>

      <ButtonFill
        label="후기 작성하기"
        onClick={onWriteReview}
      />
    </div>
  );
}