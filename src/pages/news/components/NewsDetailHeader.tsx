import type { SVGProps } from "react";
import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import Chip from "@/components/Chips";
import DateStat from "@/components/post-stat/DateStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import GalleryMainImage from "@/assets/icons/gallery-main.svg";
import ShareButton from "@/pages/news/components/ShareButton";
import type { NewsDetail } from "@/types/news";
import type { NewsStatusPresentation } from "@/utils/newsStatus";

function HomepageArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ArrowUpRightIcon
      {...props}
      className="bodeum-icon-color h-[14px] w-[14px] shrink-0 text-background-100"
    />
  );
}

interface NewsDetailHeaderProps {
  news: NewsDetail;
  status: NewsStatusPresentation;
  isScrapPending: boolean;
  onToggleScrap: () => void;
}

export default function NewsDetailHeader({
  news,
  status,
  isScrapPending,
  onToggleScrap,
}: NewsDetailHeaderProps) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-background-250 bg-background-100">
      <img
        src={news.thumbnailUrl || GalleryMainImage}
        alt={news.thumbnailUrl ? `${news.title} 대표 이미지` : ""}
        aria-hidden={!news.thumbnailUrl}
        className="h-[220px] w-full object-cover"
      />
      <div className="px-[16px] py-[24px]">
        <div className="mb-[12px] flex items-center gap-[10px]">
          <Chip className="!h-[24px]">{news.categoryLabel}</Chip>
          <Chip variant={status.variant} className="!h-[23.5px]">
            {status.label}
          </Chip>
        </div>

        <h1 className="text-h1-onboard text-background-600">{news.title}</h1>
        {news.summary && <p className="mt-[8px] text-body1 text-background-500">{news.summary}</p>}

        <div className="mt-[12px] py-2 flex items-center gap-[20px]">
          <ViewStat count={news.viewCount} showLabel />
          <ScrapStat count={news.scrapCount} isActive={news.scrapped} onClick={onToggleScrap} />
          <DateStat date={news.publishedAt} showLabel />
        </div>

        <div className="flex gap-[8px] border-t border-background-250 pt-[12px]">
          <ButtonFill
            label="홈페이지"
            icon={HomepageArrowIcon}
            iconPosition="right"
            disabled={!news.originalUrl}
            onClick={() => window.open(news.originalUrl, "_blank", "noopener,noreferrer")}
          />
          <ButtonOutline
            label="스크랩"
            icon={ScrapIcon}
            iconPosition="left"
            disabled={isScrapPending}
            onClick={onToggleScrap}
          />
          <ShareButton url={window.location.href} />
        </div>
      </div>
    </article>
  );
}
