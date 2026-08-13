import type { SVGProps } from "react";
import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import Chip from "@/components/Chips";
import DateStat from "@/components/post-stat/DateStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ShareButton from "@/components/ShareButton";
import type { NewsDetail } from "@/types/news";
import type { NewsStatusPresentation } from "@/utils/newsStatus";

function HomepageArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ArrowUpRightIcon
      {...props}
      className="bodeum-icon-color relative top-px h-[14px] w-[14px] shrink-0 text-background-100"
    />
  );
}

interface NewsDetailHeaderProps {
  news: NewsDetail;
  status?: NewsStatusPresentation;
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
      <div className="px-[16px] py-[24px]">
        <div className="mb-[12px] flex items-center gap-[10px]">
          <Chip className="!h-[24px]">{news.categoryLabel}</Chip>
          {status && (
            <Chip variant={status.variant} className="!h-[23.5px]">
              {status.label}
            </Chip>
          )}
        </div>

        <h1 className="text-h1-onboard text-background-600">{news.title}</h1>
        {news.summary && <p className="mt-[8px] text-body1 text-background-500">{news.summary}</p>}

        <div className="mt-[12px] py-2 flex items-center gap-[20px]">
          <ViewStat count={news.viewCount} showLabel />
          <ScrapStat count={news.scrapCount} isActive={news.scrapped} onClick={onToggleScrap} />
          {news.publishedAt && <DateStat date={news.publishedAt} showLabel />}
        </div>

        <div className="flex gap-[8px] border-t border-background-250 pt-[12px]">
          <ButtonFill
            label="홈페이지"
            icon={HomepageArrowIcon}
            className="h-[40px]"
            iconPosition="right"
            disabled={!news.originalUrl}
            onClick={() => {
              if (news.originalUrl) {
                window.open(news.originalUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />
          <ButtonOutline
            label="스크랩"
            icon={ScrapIcon}
            className="h-[40px]"
            iconPosition="left"
            disabled={isScrapPending}
            onClick={onToggleScrap}
          />
          <ShareButton url={window.location.href} className="h-[40px]" />
        </div>
      </div>
    </article>
  );
}
