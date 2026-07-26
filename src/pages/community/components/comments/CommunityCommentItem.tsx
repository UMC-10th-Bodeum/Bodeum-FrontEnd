import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import type { CommunityComment } from "@/types/community";
import CommunityReplyForm from "./CommunityReplyForm";
import CommunityReplyItem from "./CommunityReplyItem";

interface CommunityCommentItemProps {
  comment: CommunityComment;
  replyFormOpen: boolean;
  onToggleReplyForm: () => void;
  onSubmitReply: (parentCommentId: number, content: string) => void;
}

export default function CommunityCommentItem({
  comment,
  replyFormOpen,
  onToggleReplyForm,
  onSubmitReply,
}: CommunityCommentItemProps) {
  return (
    <li className="border-b border-background-250 py-[20px]">
      <div className="flex gap-[26.5px]">
        <ProfileIcon className="h-[40px] w-[40px] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[8px]">
            <p className="text-h6 text-background-600">{comment.author}</p>
            <time className="text-body-sub text-background-500">{comment.createdAt}</time>
          </div>
          <p className="mt-[8px] text-h3-onboard text-background-600">{comment.content}</p>
          <div className="mt-[10px] flex items-center gap-[24px] text-body-sub text-background-500">
            <HeartStat count={comment.likes} onClick={() => {}} />
            <button type="button" onClick={onToggleReplyForm} className="cursor-pointer">
              답글 달기
            </button>
          </div>
        </div>
      </div>

      {comment.replies?.map((replyItem) => (
        <CommunityReplyItem key={replyItem.id} reply={replyItem} onReplyClick={onToggleReplyForm} />
      ))}

      {replyFormOpen && (
        <CommunityReplyForm
          targetAuthor={comment.author}
          onCancel={onToggleReplyForm}
          onSubmit={(content) => onSubmitReply(comment.id, content)}
        />
      )}
    </li>
  );
}
