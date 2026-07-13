import HeartIcon from "@/assets/icons/HeartDisabled.svg?react";
import TalkIcon from "@/assets/icons/Community.svg?react"
import ViewIcon from "@/assets/icons/view.svg?react";
import RegionLabel from "@/components/RegionLabel";

interface PostListItemProps {
  title: string;
  region: string;
  likes?: number;
  talks?: number;
  views?: number;
  rightSlot?: React.ReactNode;
  onClick?: () => void;
}

export default function PostListItem({
  title,
  region,
  likes,
  talks,
  views,
  rightSlot,
  onClick,
}: PostListItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[10px] bg-background-200 px-[16px] py-[12px] cursor-pointer"
    >
      <div className="flex min-w-0 items-center gap-3">
        <RegionLabel region={region} />

        <p className="truncate text-h4-list text-gray-800">
          {title}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[8px] text-h4-list text-background-500">
        {likes !== undefined && (
          <div className="flex items-center gap-1">
            <HeartIcon className="w-[12px] h-[12px]"/>
            <span>
              {likes.toLocaleString()}
            </span>
          </div>
        )}

        {talks !== undefined && (
          <div className="flex items-center gap-1">
            <TalkIcon className="w-[12px] h-[12px]"/>
            <span>
              {talks.toLocaleString()}
            </span>
          </div>
        )}

        {views !== undefined && (
          <div className="flex items-center gap-1">
            <ViewIcon className="w-[12px] h-[12px]" />
            <span>
              {views.toLocaleString()}
            </span>
          </div>
        )}

        {rightSlot}
      </div>
    </button>
  );
}