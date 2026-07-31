import { useState, type ReactNode } from "react";

import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";
import WarningIcon from "@/assets/icons/Warning.svg?react";
import DetailBackButton from "@/components/DetailBackButton";
import PostTag from "@/components/PostTag";
import type { CommunityPost } from "@/types/community";
import { communityCategoryMap } from "@/constants/communityCategory";

interface CommunityPostDetailCardProps {
  post: CommunityPost;
  children: ReactNode;
}

export default function CommunityPostDetailCard({ post, children }: CommunityPostDetailCardProps) {
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);

  return (
    <article className="min-h-[574px] rounded-[18px] border border-background-250 bg-background-100 px-[40px] py-[20px]">
      <header className="flex items-center justify-between border-b border-background-250 pb-[20px]">
        <div className="flex min-w-0 items-center gap-[12px] [&>span:first-child]:!h-[20px]">
          <PostTag
            type="ETC"
            label={communityCategoryMap[post.category]}
          />
          <span className="truncate text-body-sub text-background-500">{post.author}</span>
        </div>
        <time className="shrink-0 text-body-sub text-background-400">{post.createdAt}</time>
      </header>

      <div className="pb-[20px] pt-[12px]">
        <h1 className="text-h1-onboard text-background-600">{post.title}</h1>
        <p className="mt-[12px] text-h3-onboard text-background-600">{post.content}</p>
      </div>

      <div className="flex items-center justify-between border-b border-background-250 py-[16px]">
        <div className="flex items-center gap-[10px]">
          <DetailBackButton
            icon={liked ? HeartIcon : HeartDisabledIcon}
            label={`공감 ${post.likes + (liked ? 1 : 0)}`}
            selected={liked}
            selectedClassName="border-sub-red text-sub-red"
            onClick={() => setLiked((current) => !current)}
          />
          <DetailBackButton
            icon={scrapped ? ScrapPressedIcon : ScrapIcon}
            label="스크랩"
            selected={scrapped}
            selectedClassName="border-sub-yellow text-sub-yellow"
            onClick={() => setScrapped((current) => !current)}
          />
          <DetailBackButton icon={ShareIcon} label="공유" onClick={() => {}} />
        </div>

        <DetailBackButton icon={WarningIcon} label="신고" tone="danger" onClick={() => {}} />
      </div>

      {children}
    </article>
  );
}
