import StarIcon from "@/assets/icons/Star.svg?react";
import ButtonFill from "@/components/button/ButtonFill";

interface Props {
  averageRating: number;
  totalReviewCount: number;
  onWriteReview: () => void;
}

export default function ReviewSummary({
  averageRating,
  totalReviewCount,
  onWriteReview,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-main-100 px-[25px] py-[16px]">
      <div>
        <div className="flex items-center">
          <StarIcon />
          <span className="text-h5-list ml-[4px] mr-[5px]">
            {averageRating} / 5.0
          </span>
          <span className="text-h4-list text-background-600">
            · {totalReviewCount}개의 후기
          </span>
        </div>

        <p className="mt-[4px] text-h6-list text-background-500">
          다른 이웃을 위해 후기를 작성해주세요
        </p>
      </div>

      <ButtonFill
        label="후기 작성하기"
        onClick={onWriteReview}
      />
    </div>
  );
}