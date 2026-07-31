import HeartIcon from "@/assets/icons/HeartDisabled.svg?react";
import CommentIcon from "@/assets/icons/Community.svg?react";
import ViewIcon from "@/assets/icons/Views.svg?react";
import PostTag from "@/components/PostTag";
import { getRelativeTime } from "@/utils/time";
import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  postId: number;
  categoryName: string;
  authorDisplay: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export default function CommunityCard({
  postId,
  authorDisplay,
  title,
  content,
  likeCount,
  commentCount,
  viewCount,
  createdAt,
  categoryName,
}: CommunityCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/community/${postId}`)}
      className="flex w-[380px] shrink-0 flex-col rounded-[10px] border border-background-250 bg-background-100 p-[16px] text-left cursor-pointer"
    >
      <div className="mb-[8px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PostTag
            type="ETC"
            label={categoryName}
          />
          <span className="text-body-sub text-background-500">{authorDisplay}</span>
        </div>

        <span className="text-body-sub text-background-500">{getRelativeTime(createdAt)}</span>
      </div>

      <h3 className="mb-[8px] line-clamp-1 text-h5-list text-background-600">{title}</h3>

      <p className="line-clamp-2 flex-1 text-h6-list text-background-500">{content}</p>

      <div className="mt-[8px] flex items-center gap-[14px] border-t border-background-250 pt-[8px] text-h4-list text-background-500">
        <div className="flex items-center gap-1">
          <HeartIcon className="h-[12px] w-[12px]" />
          <span>{likeCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <CommentIcon className="h-[12px] w-[12px]" />
          <span>{commentCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <ViewIcon className="h-[12px] w-[12px]" />
          <span>{viewCount.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
}
