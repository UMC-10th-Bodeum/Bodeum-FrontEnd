import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import type { CommunityComment } from "@/types/community";

interface CommunityReplyItemProps {
  reply: CommunityComment;
  onReplyClick: () => void;
}

export default function CommunityReplyItem({ reply, onReplyClick }: CommunityReplyItemProps) {
  return (
    <div className="relative ml-[18px] mt-[16px] pl-[48.5px] before:absolute before:left-0 before:top-[8px] before:h-[24px] before:w-[24px] before:border-b before:border-l before:border-background-300">
      <div className="flex min-w-0 items-center gap-[8px]">
        <ProfileIcon className="h-[24px] w-[24px] shrink-0" />
        <strong className="text-h6 text-background-600">{reply.author}</strong>
        <time className="text-body-sub text-background-500">{reply.createdAt}</time>
      </div>
      <div>
        <p className="mt-[8px] text-h6-list text-h3-onboard">{reply.content}</p>
        <div className="mt-[16px] flex items-center gap-[24px] text-body-sub text-background-500">
          <HeartStat count={reply.likes} onClick={() => {}} />
          <button type="button" onClick={onReplyClick} className="cursor-pointer">
            답글 달기
          </button>
        </div>
      </div>
    </div>
  );
}
