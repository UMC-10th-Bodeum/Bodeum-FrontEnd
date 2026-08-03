import ProfileIcon from "@/assets/icons/Profile.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import FeedbackButton from "@/components/FeedbackButton";

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
  review: Review;
}

export default function ReviewCard({ review }: Props) {
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
              {review.createdAt}
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
          defaultSelected={false}
          defaultCount={review.helpfulCount}
          className="text-h6-list"
        />
      </div>
    </div>
  );
}