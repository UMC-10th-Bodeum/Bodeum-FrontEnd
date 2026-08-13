import { toggleReviewHelpful } from "@/apis/infoApi";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import FeedbackButton from "@/components/button/FeedbackButton";
import { showToast } from "@/components/Toast";
import { formatDate } from "@/utils/time";
import { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  infoReviewId: number;
  userId: number;
  userNickname: string;
  rating: number;
  content: string;
  imageUrls: string[];
  isHelpful: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface Props {
  infoItemId: number;
  review: Review;
}

export default function ReviewCard({ infoItemId, review }: Props) {
  const [isHelpful, setIsHelpful] = useState(review.isHelpful);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);

  useEffect(() => {
    setIsHelpful(review.isHelpful);
    setHelpfulCount(review.helpfulCount);
  }, [review.isHelpful, review.helpfulCount]);

  const handleHelpful = async () => {
    try {
      const result = await toggleReviewHelpful(
        infoItemId,
        review.infoReviewId,
      );

      setIsHelpful(result.isHelpful);
      setHelpfulCount(result.helpfulCount);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "red",
          error.response?.data?.message ?? "도움돼요 등록에 실패했습니다."
        );
      } else {
        showToast("red", "도움돼요 등록에 실패했습니다.");
      }
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
        </div>

        <p className="my-[7px] whitespace-pre-wrap text-h6-list text-background-600">
          {review.content}
        </p>

        <FeedbackButton
          feedbackType="Good"
          selected={isHelpful}
          count={helpfulCount}
          className="text-h6-list"
          onClick={handleHelpful}
        />
      </div>
    </div>
  );
}