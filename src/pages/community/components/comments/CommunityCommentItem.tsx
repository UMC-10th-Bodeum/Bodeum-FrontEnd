import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import type { CommunityComment } from "@/types/community";
import CommunityReplyForm from "./CommunityReplyForm";
import CommunityReplyItem from "./CommunityReplyItem";

interface CommunityCommentItemProps {
  comment: CommunityComment;
  replyTargetId: number | null;
  onSelectReplyTarget: (comment: CommunityComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentCommentId: number, content: string) => void;
  isReplyPending: boolean;
  onLike: (commentId: number, isCurrentlyLiked: boolean) => void;
  likingCommentId?: number;
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function CommunityCommentItem({
  comment,
  replyTargetId,
  onSelectReplyTarget,
  onCancelReply,
  onSubmitReply,
  isReplyPending,
  onLike,
  likingCommentId,
}: CommunityCommentItemProps) {
  return (
    <li className="pt-[20px]">
      <div className="flex gap-[26.5px] border-b border-background-250 pb-[20px]">
        <ProfileIcon className="h-[40px] w-[40px] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[8px]">
            <p className="text-h6 text-background-600">
              {comment.authorNickname || "익명"}
            </p>
            <time className="text-body-sub text-background-500">
              {formatCreatedAt(comment.createdAt)}
            </time>
          </div>
          <p className="mt-[8px] text-h3-onboard text-background-600">{comment.content}</p>
          <div className="mt-[10px] flex items-center gap-[24px] text-body-sub text-background-500">
            <HeartStat
              count={comment.likeCount}
              isActive={comment.isLiked}
              disabled={likingCommentId === comment.commentId}
              onClick={() => onLike(comment.commentId, comment.isLiked)}
            />
            <button
              type="button"
              onClick={() => onSelectReplyTarget(comment)}
              className="cursor-pointer"
            >
              답글 달기
            </button>
          </div>
        </div>
      </div>

      {replyTargetId === comment.commentId && (
        <CommunityReplyForm
          targetAuthor={comment.authorNickname || "익명"}
          isSubmitting={isReplyPending}
          onCancel={onCancelReply}
          onSubmit={(content) => onSubmitReply(comment.commentId, content)}
        />
      )}

      {comment.replies?.map((replyItem) => (
        <CommunityReplyItem
          key={replyItem.commentId}
          reply={replyItem}
          replyTargetId={replyTargetId}
          onSelectReplyTarget={onSelectReplyTarget}
          onCancelReply={onCancelReply}
          onSubmitReply={onSubmitReply}
          isReplyPending={isReplyPending}
          onLike={onLike}
          likingCommentId={likingCommentId}
        />
      ))}
    </li>
  );
}
