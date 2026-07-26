import { useState } from "react";
import PostTag from "@/components/PostTag";
import CommentStat from "@/components/post-stat/CommentStat";
import HeartStat from "@/components/post-stat/HeartStat";
import ViewStat from "@/components/post-stat/ViewStat";

interface CommunityPostCardProps {
  id: number;
  board: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  imageCount: number;
  createdAt: string;
  onClick?: () => void;
}

export default function CommunityPostCard({
  board,
  title,
  content,
  likes,
  comments,
  views,
  createdAt,
  onClick,
}: CommunityPostCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        onClick?.();
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className="flex h-[102px] w-[578px] min-w-0 cursor-pointer flex-col rounded-[10px] border border-background-250 bg-background-100 p-[16px] hover:shadow-[1px_2px_15px_0px_#00000026] active:border-main-400"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <PostTag type="ETC" label={board} />
          <div className="flex gap-[14px]">
            <HeartStat
              count={likes + (liked ? 1 : 0)}
              isActive={liked}
              onClick={() => setLiked((prev) => !prev)}
            />
            <CommentStat count={comments} />
            <ViewStat count={views} />
          </div>
        </div>
        <span className="shrink-0 text-body-sub text-background-400">{createdAt}</span>
      </div>

      <p className="mt-[8px] line-clamp-1 text-h5-list text-background-600">{title}</p>
      <p className="mt-[4px] line-clamp-1 text-h6-list text-background-500">{content}</p>
    </article>
  );
}
