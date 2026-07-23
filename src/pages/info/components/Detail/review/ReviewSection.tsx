import MessageIcon from "@/assets/icons/Community.svg?react";
import Section from "../Section";
import EmptyReview from "./EmptyReview";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ButtonOutline from "@/components/ButtonOutline";
import { useState } from "react";

interface Review {
  id: number;
  rating: number;
  nickname: string;
  createdAt: string;
  content: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  totalReviewCount: number;
  averageRating: number;
  onWriteReview: () => void;
  onMore: () => void;
}

const INITIAL_COUNT = 3;

export default function ReviewSection({
  reviews,
  totalReviewCount,
  averageRating,
  onWriteReview,
}: ReviewSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleReviews = reviews.slice(0, visibleCount);
  const remainCount = reviews.length - visibleCount;

  return (
    <Section
      icon={<MessageIcon />}
      title={
        <>
          <span className="text-h2-list text-background-600">후기 </span>
          <span className="text-h2-list text-main-400">
            {reviews.length}
            <span className="text-h2-list text-background-600">개</span>
          </span>
        </>
      }
    >
      {reviews.length === 0 ? (
        <EmptyReview onWriteReview={onWriteReview} />
      ) : (
        <>
          <ReviewSummary
            averageRating={averageRating}
            totalReviewCount={totalReviewCount}
            onWriteReview={onWriteReview}
          />

          <div className="my-[14px] flex flex-col">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
            
          {remainCount > 0 && (
            <ButtonOutline
              onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
              label={`후기 ${remainCount}개 더보기`}
              size="L"
            />
          )}
        </>
      )}
    </Section>
  );
}