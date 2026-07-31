import Chip, { type ChipVariant } from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import BaseInfoCard from "./BaseInfoCard";

import InfoItemNewsIcon from "@/assets/icons/InfoItem-news.svg?react";

const noop = () => {};

const programCategoryInfo = {
  label: "프로그램",
  bgColor: "bg-background-200",
  textColor: "text-background-600",
  pressedBorderColor: "peer-active:border-main-400",
} as const;

interface ProgramItemProps {
  name: string;
  address: string;
  services: string[];
  chipText?: string;
  chipVariant?: ChipVariant;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
  onClick?: () => void;
  onScrapClick?: () => void;
}

export default function ProgramItem({
  name,
  address,
  services,
  chipText,
  chipVariant,
  viewCount,
  scrapCount,
  isScrapped = false,
  onClick,
  onScrapClick,
}: ProgramItemProps) {
  return (
    <BaseInfoCard
      pressedBorderColor="peer-active:border-main-400"
      onClick={onClick}
      icon={
        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[10px] bg-main-100">
          <InfoItemNewsIcon className="h-[60px] w-[60px]" />
        </div>
      }
      left={
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-[4px]">
            <span
              className={`shrink-0 rounded-[10px] ${programCategoryInfo.bgColor} px-2 py-[5px] text-h5-list leading-none ${programCategoryInfo.textColor}`}
            >
              {programCategoryInfo.label}
            </span>
            <h3 className="truncate text-h2-list text-background-600">{name}</h3>
          </div>

          <p className="mt-1 truncate text-h6-list text-background-600">{address}</p>

          <p className="mt-0.5 truncate text-body-sub text-background-500">{services}</p>
        </div>
      }
      right={
        <div className="flex h-[64px] w-[130px] shrink-0 flex-col items-end justify-center gap-[11px]">
          <div className="flex h-[33px] w-full items-end justify-center">
            <Chip variant={chipVariant} className="min-w-[100px]">
              {chipText}
            </Chip>
          </div>

          <div className="flex h-5 w-full items-center justify-center gap-2">
            <ViewStat count={viewCount} />
            <span className="relative z-20 inline-flex h-5 items-center">
              <ScrapStat count={scrapCount} isActive={isScrapped} onClick={onScrapClick ?? noop} />
            </span>
          </div>
        </div>
      }
    />
  );
}
