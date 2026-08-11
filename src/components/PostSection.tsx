import type { ReactNode } from "react";

import RightIcon from "@/assets/icons/ChevronRight.svg?react";

interface PostSectionProps {
  title: string;
  children: ReactNode;
  onMoreClick?: () => void;
}

export default function PostSection({
  title,
  children,
  onMoreClick,
}: PostSectionProps) {
  return (
    <section className="w-full">
      <div className="mb-[16px] flex items-center justify-between border-b border-background-300 pb-[8px]">
        <h2 className="text-h6 text-background-600">{title}</h2>

        <button
          onClick={onMoreClick}
          className="text-h6-list text-background-500 flex items-center gap-[4.66px] cursor-pointer"
        >
          더보기
          <RightIcon className="text-background-500" />
        </button>
      </div>

      <div className="flex flex-col gap-[8px]">{children}</div>
    </section>
  );
}
