import { toggleReviewHelpful } from "@/apis/info";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import FeedbackButton from "@/components/FeedbackButton";
import { showToast } from "@/components/Toast";
import { formatDate } from "@/utils/time";
import { useState } from "react";

interface Review {
  infoReviewId: number;
  userId: number;
  userNickname: string;
  rating: number;
  content: string;
  imageUrls: string[];
  helpfulCount: number;
  createdAt: string;
}

interface Props {
  infoItemId: number;
  review: Review;
}

export default function ReviewCard({ infoItemId, review }: Props) {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);

  const handleHelpful = async () => {
    try {
      const result = await toggleReviewHelpful(
        infoItemId,
        review.infoReviewId,
      );

      setIsHelpful(result.isHelpful);
      setHelpfulCount(result.helpfulCount);
    } catch {
      showToast("red", "도움돼요 등록에 실패했습니다.");
    }
  };

  return (
    <div className="flex gap-[6px] pt-[16px] pb-[10px] border-b border-background-250">
      <ProfileIcon />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon />

            <span className="text-h5-list text-main-500 ml-[4px] mr-[7px]">
              {review.rating}
            </span>

            <span className="text-h6 text-background-600 mr-[8px]">
              {review.userNickname}
            </span>

            <span className="text-body-sub text-background-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <button className="text-body-sub text-background-500">
            신고
          </button>
        </div>

        <p className="my-[7px] whitespace-pre-wrap text-h6-list text-background-600">
          {review.content}
        </p>

        <FeedbackButton
          feedbackType="Good"
          defaultSelected={isHelpful}
          defaultCount={helpfulCount}
          className="text-h6-list"
          onClick={handleHelpful}
        />
      </div>
    </div>
  );
}