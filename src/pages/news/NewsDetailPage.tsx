import { type SVGProps, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import Chip from "@/components/Chips";
import CommentStat from "@/components/post-stat/CommentStat";
import DateStat from "@/components/post-stat/DateStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import { infoCategoryMap } from "@/constants/infoCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";
import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";
import GalleryMainImage from "@/assets/icons/gallery-main.svg";
import PostListItem from "../home/components/PostListItem";
import PostSection from "../home/components/PostSection";
import HeartStat from "@/components/post-stat/HeartStat";
import { getNewsListItemById, type NewsListItem, type NewsType } from "./data/newsMockData";
import AIChatButton from "@/components/AIChatButton";

const breadcrumbLabelMap: Record<NewsType, string> = {
  ACTIVITY: "활동소식",
  LOCAL: "지역 소식",
};

const detailExtra = {
  updatedAt: "2026.05.04",
  reviewCount: 38,
  period: "2026.02.13",
  phone: "000-000-0000",
  target: "또래보다 언어발달이 느린 아이 / 발음이 또렷하지 않은 아이 / 말하는 단어 수가 적은 아이",
  postedAt: "2025.11.24",
};

const relatedNews = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  region: "부산 수영구",
  title: "언어치료 프로그램 이용자 모집",
  views: 1204,
  scraps: 142,
}));

const noop = () => {};

function HomepageArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ArrowUpRightIcon
      {...props}
      className="bodeum-icon-color h-[14px] w-[14px] shrink-0 text-background-100"
    />
  );
}

export default function NewsDetailPage() {
  const location = useLocation();
  const { id } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const detailState = location.state as {
    item?: NewsListItem;
  } | null;
  const routeItem = getNewsListItemById(id);
  const stateItem = detailState?.item;
  const cardItem = routeItem && stateItem?.id === routeItem.id ? stateItem : routeItem;
  const breadcrumbLabel = cardItem ? breadcrumbLabelMap[cardItem.newsType] : "소식";
  const organization = cardItem?.services[0] ?? "";
  const activityInfo = [
    ["진행기간", detailExtra.period],
    ["신청기간", detailExtra.period],
    ["지역", cardItem?.address ?? ""],
    ["주관기관", organization],
    ["대상", detailExtra.target],
    ["문의", detailExtra.phone],
    ["담당자", organization],
    ["게시일", detailExtra.postedAt],
  ];

  useEffect(() => {
    setBreadcrumb([{ label: "소식" }, { label: breadcrumbLabel }]);

    return () => setBreadcrumb([]);
  }, [breadcrumbLabel, setBreadcrumb]);

  if (!cardItem) {
    return (
      <div className="min-h-full px-[32px] py-[20px]">
        <div className="mx-auto w-[680px] rounded-[8px] border border-background-250 bg-background-100 px-[20px] py-[28px] text-center text-h5 text-background-500">
          선택된 소식 정보가 없습니다.
        </div>
      </div>
    );
  }

  const categoryLabel =
    cardItem.type === "PROGRAM" ? "프로그램" : infoCategoryMap[cardItem.type].label;

  return (
    <div className="min-h-full px-[32px] py-[20px]">
      <div className="mx-auto grid max-w-[1098px] grid-cols-[680px_400px] items-start gap-[18px]">
        <div className="flex flex-col gap-[11px]">
          <article className="overflow-hidden rounded-[10px] border border-background-250 bg-background-100">
            <img
              src={GalleryMainImage}
              alt=""
              aria-hidden="true"
              className="h-[220px] w-full object-cover"
            />
            <div className="px-[16px] py-[24px]">
              <div className="mb-[12px] flex items-center gap-[10px]">
                <Chip>{categoryLabel}</Chip>
                {cardItem.chipText && (
                  <Chip variant={cardItem.chipVariant}>{cardItem.chipText}</Chip>
                )}
              </div>

              <h1 className="text-h1-onboard text-background-600">{cardItem.name}</h1>

              <div className="mt-[12px] py-2 flex items-center gap-[20px]">
                <ViewStat count={cardItem.viewCount} showLabel />
                <ScrapStat
                  count={cardItem.scrapCount}
                  isActive={cardItem.isScrapped}
                  onClick={noop}
                />
                <CommentStat count={detailExtra.reviewCount} showLabel />
                <DateStat date={detailExtra.updatedAt} showLabel />
              </div>

              <div className="flex gap-[8px] border-t border-background-250 pt-[12px]">
                <ButtonFill label="홈페이지" icon={HomepageArrowIcon} iconPosition="right" />
                <ButtonOutline label="스크랩" icon={ScrapIcon} iconPosition="left" />
                <ButtonOutline label="공유" tone="black" icon={ShareIcon} iconPosition="left" />
              </div>
            </div>
          </article>

          <section className="rounded-[10px] border border-background-250 bg-background-100 px-[24px] pt-[20px] pb-[10px]">
            <h2 className="mb-[14px] flex items-center gap-[8px] text-h2-list text-background-600">
              <UpdateAtIcon className="h-[16px] w-[16px]" aria-hidden="true" />
              활동 정보
            </h2>

            <dl>
              {activityInfo.map(([label, value]) => (
                <div
                  key={label}
                  className="mb-[10px] grid min-h-[38px] grid-cols-[64px_1fr] items-center border-b border-background-250"
                >
                  <dt className="text-h6-list text-background-500">{label}</dt>
                  <dd className="text-h6-list text-background-600">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="py-[20px]">
            <PostSection title="부산에서 모집중인 소식">
              {relatedNews.map((item) => (
                <PostListItem
                  key={item.id}
                  region={item.region}
                  title={item.title}
                  rightSlot={
                    <>
                      <HeartStat count={item.scraps} onClick={noop} />
                      <ViewStat count={item.views} />
                    </>
                  }
                />
              ))}
            </PostSection>
          </div>
        </div>

        <AIChatButton />
      </div>
    </div>
  );
}
