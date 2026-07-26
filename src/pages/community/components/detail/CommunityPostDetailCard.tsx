import type { ReactNode } from "react";

import GoodIcon from "@/assets/icons/Good.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";
import WarningIcon from "@/assets/icons/Warning.svg?react";
import DetailBackButton from "@/components/DetailBackButton";
import PostTag from "@/components/PostTag";
import type { CommunityPost } from "@/types/community";

interface CommunityPostDetailCardProps {
  post: CommunityPost;
  children: ReactNode;
}

export default function CommunityPostDetailCard({ post, children }: CommunityPostDetailCardProps) {
  return (
    <article className="min-h-[574px] rounded-[18px] border border-background-250 bg-background-100 px-[40px] py-[20px]">
      <header className="flex items-center justify-between border-b border-background-250 pb-[20px]">
        <div className="flex min-w-0 items-center gap-[12px]">
          <PostTag type={post.diagnosis} />
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
          <DetailBackButton icon={GoodIcon} label={`공감 ${post.likes}`} onClick={() => {}} />
          <DetailBackButton icon={ScrapIcon} label="스크랩" onClick={() => {}} />
          <DetailBackButton icon={ShareIcon} label="공유" onClick={() => {}} />
        </div>

        <DetailBackButton icon={WarningIcon} label="신고" tone="danger" onClick={() => {}} />
      </div>

      {children}
    </article>
  );
}
