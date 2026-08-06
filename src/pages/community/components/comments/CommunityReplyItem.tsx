import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import type { CommunityComment } from "@/types/community";
import CommunityReplyForm from "./CommunityReplyForm";

interface CommunityReplyItemProps {
  reply: CommunityComment;
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

export default function CommunityReplyItem({
  reply,
  replyTargetId,
  onSelectReplyTarget,
  onCancelReply,
  onSubmitReply,
  isReplyPending,
  onLike,
  likingCommentId,
}: CommunityReplyItemProps) {
  return (
    <div>
      <div className="border-b border-background-250">
        <div className="relative ml-[18px] py-[20px] pl-[48.5px] before:absolute before:left-0 before:top-[28px] before:h-[24px] before:w-[24px] before:border-b before:border-l before:border-background-300">
          <div className="flex min-w-0 items-center gap-[8px]">
            <ProfileIcon className="h-[24px] w-[24px] shrink-0" />
            <strong className="text-h6 text-background-600">
              {reply.authorNickname || "익명"}
            </strong>
            <time className="text-body-sub text-background-500">
              {formatCreatedAt(reply.createdAt)}
            </time>
          </div>
          <div>
            <p className="mt-[8px] text-h6-list text-h3-onboard">{reply.content}</p>
            <div className="mt-[16px] flex items-center gap-[24px] text-body-sub text-background-500">
              <HeartStat
                count={reply.likeCount}
                isActive={reply.isLiked}
                disabled={likingCommentId === reply.commentId}
                onClick={() => onLike(reply.commentId, reply.isLiked)}
              />
              <button
                type="button"
                onClick={() => onSelectReplyTarget(reply)}
                className="cursor-pointer"
              >
                답글 달기
              </button>
            </div>
          </div>
        </div>
      </div>

      {replyTargetId === reply.commentId && (
        <CommunityReplyForm
          targetAuthor={reply.authorNickname || "익명"}
          isSubmitting={isReplyPending}
          onCancel={onCancelReply}
          onSubmit={(content) => onSubmitReply(reply.commentId, content)}
        />
      )}

      {reply.replies?.map((nestedReply) => (
        <CommunityReplyItem
          key={nestedReply.commentId}
          reply={nestedReply}
          replyTargetId={replyTargetId}
          onSelectReplyTarget={onSelectReplyTarget}
          onCancelReply={onCancelReply}
          onSubmitReply={onSubmitReply}
          isReplyPending={isReplyPending}
          onLike={onLike}
          likingCommentId={likingCommentId}
        />
      ))}
    </div>
  );
}
