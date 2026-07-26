import { useState } from "react";

import CommentStat from "@/components/post-stat/CommentStat";
import HeartStat from "@/components/post-stat/HeartStat";
import ViewStat from "@/components/post-stat/ViewStat";

interface CommunityRelatedPostCardProps {
  title: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  onClick?: () => void;
}

export default function CommunityRelatedPostCard({
  title,
  createdAt,
  likes,
  comments,
  views,
  onClick,
}: CommunityRelatedPostCardProps) {
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
        if (event.key === "Enter" || event.key === " ") onClick?.();
      }}
      className="flex h-[44px] w-[1128px] cursor-pointer items-center rounded-[10px] border border-transparent bg-background-200 px-[16px] py-[12px] text-left transition-[border-color,box-shadow] duration-300 ease-out hover:shadow-[1px_2px_15px_0px_#00000026] active:border-background-500"
    >
      <time className="mr-[8px] text-body-sub-2 text-background-500">{createdAt}</time>
      <span className="min-w-0 flex-1 truncate text-h5-list text-background-600">{title}</span>
      <span className="flex shrink-0 items-center gap-[14px]">
        <HeartStat
          count={likes + (liked ? 1 : 0)}
          isActive={liked}
          onClick={() => setLiked((current) => !current)}
        />
        <CommentStat count={comments} />
        <ViewStat count={views} />
      </span>
    </article>
  );
}
