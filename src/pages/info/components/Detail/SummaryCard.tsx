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
import { getInfoShareUrl, toggleInfoScrap } from "@/apis/info";
import { showToast } from "@/components/Toast";
import { useEffect, useState } from "react";

interface SummaryCardProps {
  infoItemId: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  homepageUrl?: string;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  isScrapped: boolean;
  address: string;
  sido: string;
  sigungu: string;
  phone: string;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;

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
  infoItemId,
  name,
  mainCategory,
  subCategory,
  homepageUrl,
  viewCount,
  scrapCount,
  reviewCount,
  address,
  sido,
  sigungu,
  phone,
  isScrapped,
}: SummaryCardProps) {
  const [scrapCountState, setScrapCountState] = useState(scrapCount);
  const [isScrappedState, setIsScrappedState] = useState(isScrapped);

  useEffect(() => {
    setScrapCountState(scrapCount);
    setIsScrappedState(isScrapped);
  }, [scrapCount, isScrapped]);
  const handleShare = async () => {
    try {
      const { shareUrl } = await getInfoShareUrl(infoItemId);

      await navigator.clipboard.writeText(shareUrl);

      showToast("green", "공유 링크가 복사되었습니다.");
    } catch {
      showToast("red", "공유 링크를 가져오지 못했습니다.");
    }
  };

  const handleScrap = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("blue", "로그인/회원가입 후 만나보세요");
      return;
    }

    try {
      const result = await toggleInfoScrap(infoItemId);

      setIsScrappedState(result.isScrapped);
      setScrapCountState(result.scrapCount);

      showToast(
        "green",
        result.isScrapped
          ? "스크랩되었습니다."
          : "스크랩이 취소되었습니다.",
      );
    } catch {
      showToast("red", "스크랩에 실패했습니다.");
    }
  };

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
            count={scrapCountState}
            isActive={isScrappedState}
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
              if (!homepageUrl) {
                showToast("yellow", "등록된 홈페이지가 없습니다.");
                return;
              }

              window.open(homepageUrl, "_blank", "noopener,noreferrer");
            }}
          />

          <ButtonOutline
            tone="primary"
            label="스크랩"
            icon={ScrapIcon}
            iconPosition="left"
            onClick={handleScrap}
          />

          <ButtonOutline
            tone="black"
            label="공유"
            icon={ShareIcon}
            iconPosition="left"
            onClick={handleShare}
          />
        </div>
        <div className="mt-[32px]">
          <div className="flex flex-row items-center text-h2-list gap-2">
            <Building />
            <h2>기본 정보</h2>
          </div>
          <div className="mt-[4px] mb-[12px] overflow-hidden">
            <InfoRow label="주소" value={address} />
            <InfoRow
              label="지역"
              value={`${sido ?? ""} ${sigungu ?? ""}`.trim()}
            />
            <InfoRow label="전화번호" value={phone} />
          </div>
        </div>
      </div>
    </div>
  );
}