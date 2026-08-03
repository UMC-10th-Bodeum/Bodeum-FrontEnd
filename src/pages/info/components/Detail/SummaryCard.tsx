import ShareIcon from "@/assets/icons/Share.svg?react";
import CategoryLabel from "@/components/CategoryLabel";
import ButtonFill from "@/components/ButtonFill";
import GoIcon from "@/assets/icons/arrow-up-right.svg?react"
import ScrapIcon from "@/assets/icons/Scrap.svg?react"
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import CommentStat from "@/components/post-stat/CommentStat";
import DateStat from "@/components/post-stat/DateStat";
import PostTag from "@/components/PostTag";
import ButtonOutline from "@/components/ButtonOutline";
import Building from "@/assets/icons/Building.svg?react"

interface SummaryCardProps {
  name: string;
  mainCategory: string;
  subCategory: string;
  homepageUrl?: string;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  isScrapped: boolean;
  onScrap: () => void;
  onShare: () => void;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center border-b border-background-250">
      <div className="w-[60px] shrink-0 bg-background-50 py-[10px] text-h6-list text-background-500">
        {label}
      </div>

      <div className="flex-1 text-h6-list text-background-600 break-keep">
        {value}
      </div>
    </div>
  );
}

export default function SummaryCard({
  name,
  mainCategory,
  subCategory,
  homepageUrl,
  viewCount,
  scrapCount,
  reviewCount,
  onScrap,
  onShare,
}: SummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-background-250 bg-background-100">
      <div className="px-[25px] py-[24px]">
        <div className="flex items-center gap-[10px] mb-[12px]">
          <CategoryLabel category={mainCategory as any} />
          
          <PostTag
            type="ETC"
            label={subCategory}
          />
        </div>

        <h1 className="text-h1-onboard">{name}</h1>

        <div className="flex gap-x-5 mb-[8px]">
          <ViewStat count={viewCount} showLabel={true} />
          <ScrapStat
            count={scrapCount}
            isActive={false}
            onClick={() => { }}
          />
          <CommentStat count={reviewCount} showLabel={true} />
          <DateStat date="2026.05.04" showLabel={true} />
        </div>

        <div className="border-b border-main-100 mb-[12px]" />

        <div className="flex gap-[8px]">
          <ButtonFill
            label="홈페이지"
            icon={GoIcon}
            iconPosition="right"
            onClick={() => {
              if (homepageUrl) {
                window.open(homepageUrl, "_blank");
              }
            }}
          />

          <ButtonOutline
            tone="primary"
            label="스크랩"
            icon={ScrapIcon}
            iconPosition="left"
            onClick={onScrap}
          />

          <ButtonOutline
            tone="black"
            label="공유"
            icon={ShareIcon}
            iconPosition="left"
            onClick={onShare}
          />
        </div>
        <div className="mt-[32px]">
          <div className="flex flex-row items-center text-h2-list gap-2">
            <Building />
            <h2>기본 정보</h2>
          </div>
          <div className="overflow-hidden mt-[4px] mb-[12px]">
            <InfoRow label="주소" value="서울특별시 광진구 능동로 120-1" />
            <InfoRow label="지역" value="서울특별시 광진구" />
            <InfoRow label="전화번호" value="1588-1533" />
          </div>
        </div>
      </div>
    </div>
  );
}