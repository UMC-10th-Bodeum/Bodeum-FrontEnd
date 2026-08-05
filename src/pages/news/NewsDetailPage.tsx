import { type SVGProps, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import Chip from "@/components/Chips";
import DateStat from "@/components/post-stat/DateStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";
import GalleryMainImage from "@/assets/icons/gallery-main.svg";
import AIChatButton from "@/components/AIChatButton";
import { useNewsDetail, useRelatedNews, useToggleNewsScrap } from "@/hooks/useNews";
import type { NewsType } from "@/types/news";
import PostListItem from "@/components/PostListItem";
import PostSection from "@/components/PostSection";
import { showToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/apis/apiError";
import { getNewsStatusPresentation } from "@/utils/newsStatus";
import ShareButton from "@/pages/news/components/ShareButton";
import { formatRegionDisplayLabel } from "@/constants/regions";

const breadcrumbLabelMap: Record<NewsType, string> = {
  ACTIVITY: "활동소식",
  LOCAL: "지역소식",
};

function HomepageArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ArrowUpRightIcon
      {...props}
      className="bodeum-icon-color h-[14px] w-[14px] shrink-0 text-background-100"
    />
  );
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const parsedNewsId = Number(id);
  const newsId = Number.isSafeInteger(parsedNewsId) && parsedNewsId > 0 ? parsedNewsId : undefined;
  const { data: news, isPending, isError } = useNewsDetail(newsId);
  const {
    data: relatedNews = [],
    isPending: isRelatedNewsPending,
    isError: isRelatedNewsError,
  } = useRelatedNews(newsId);
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleNewsScrap();
  const breadcrumbLabel = news ? breadcrumbLabelMap[news.newsType] : "소식";
  const activityInfo = [
    ["진행기간", `${news?.programStartDate ?? "-"} ~ ${news?.programEndDate ?? "-"}`],
    ["신청기간", `${news?.applyStartDate ?? "-"} ~ ${news?.applyEndDate ?? "-"}`],
    ["지역", news?.region || "-"],
    ["주관기관", news?.sourceName || "-"],
    ["대상", news?.targetAudience || "-"],
    ["문의", news?.contact || "-"],
    ["담당자", news?.manager || "-"],
    ["게시일", news?.publishedAt || "-"],
  ];

  useEffect(() => {
    setBreadcrumb([{ label: "소식" }, { label: breadcrumbLabel }]);

    return () => setBreadcrumb([]);
  }, [breadcrumbLabel, setBreadcrumb]);

  if (newsId === undefined || isPending || isError || !news) {
    return (
      <div className="flex min-h-full items-center justify-center px-[32px] py-[20px]">
        <div className="text-center text-h5 text-background-500">
          {newsId !== undefined && isPending
            ? "소식 정보를 불러오는 중입니다..."
            : "소식 정보를 불러오지 못했습니다."}
        </div>
      </div>
    );
  }

  const status = getNewsStatusPresentation(news.status, news.applyEndDate);
  const regionLevel1Label =
    formatRegionDisplayLabel(news.region?.trim().split(/\s+/)[0] ?? "") || "해당 지역";
  const handleRelatedNewsMoreClick = () => {
    const params = new URLSearchParams();
    const [regionLevel1, regionLevel2] = news.region?.trim().split(/\s+/) ?? [];

    if (regionLevel1) {
      params.set("regionLevel1", regionLevel1);
    }

    if (regionLevel2) {
      params.set("regionLevel2", regionLevel2);
    }

    params.set("newsType", news.newsType);
    navigate(`/news?${params.toString()}`);
  };

  const handleToggleScrap = () => {
    if (isScrapPending) {
      return;
    }

    toggleScrap(news.newsId, {
      onSuccess: (result) => {
        showToast(
          "green",
          result.scrapped ? "소식을 스크랩했습니다." : "소식 스크랩을 취소했습니다.",
        );
      },
      onError: (error) => {
        showToast("red", getApiErrorMessage(error, "스크랩 상태를 변경하지 못했습니다."));
      },
    });
  };

  return (
    <div className="min-h-full px-[32px] py-[20px]">
      <div className="mx-auto grid max-w-[1098px] grid-cols-[680px_400px] items-start gap-[18px]">
        <div className="flex flex-col gap-[11px]">
          <article className="overflow-hidden rounded-[10px] border border-background-250 bg-background-100">
            <img
              src={news.thumbnailUrl || GalleryMainImage}
              alt={news.thumbnailUrl ? `${news.title} 대표 이미지` : ""}
              aria-hidden={!news.thumbnailUrl}
              className="h-[220px] w-full object-cover"
            />
            <div className="px-[16px] py-[24px]">
              <div className="mb-[12px] flex items-center gap-[10px]">
                <Chip>{news.categoryLabel}</Chip>
                <Chip variant={status.variant}>{status.label}</Chip>
              </div>

              <h1 className="text-h1-onboard text-background-600">{news.title}</h1>
              {news.summary && (
                <p className="mt-[8px] text-body1 text-background-500">{news.summary}</p>
              )}

              <div className="mt-[12px] py-2 flex items-center gap-[20px]">
                <ViewStat count={news.viewCount} showLabel />
                <ScrapStat
                  count={news.scrapCount}
                  isActive={news.scrapped}
                  onClick={handleToggleScrap}
                />
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
                  onClick={handleToggleScrap}
                />
                <ShareButton url={window.location.href} />
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
            <PostSection
              title={`${regionLevel1Label}에서 모집 중인 소식`}
              onMoreClick={handleRelatedNewsMoreClick}
            >
              {isRelatedNewsPending && (
                <p className="py-[20px] text-center text-h6-list text-background-500">
                  관련 소식을 불러오는 중입니다...
                </p>
              )}
              {isRelatedNewsError && (
                <p className="py-[20px] text-center text-h6-list text-background-500">
                  관련 소식을 불러오지 못했습니다.
                </p>
              )}
              {!isRelatedNewsPending && !isRelatedNewsError && relatedNews.length === 0 && (
                <p className="py-[20px] text-center text-h6-list text-background-500">
                  같은 지역에서 모집 중인 소식이 없습니다.
                </p>
              )}
              {relatedNews.map((item) => (
                <PostListItem
                  key={item.newsId}
                  region={item.region}
                  title={item.title}
                  rightSlot={
                    <span className="inline-flex items-center gap-[8px]">
                      <ViewStat count={item.viewCount} />
                      <ScrapStat
                        count={item.scrapCount}
                      />
                    </span>
                  }
                  onClick={() => navigate(`/news/${item.newsId}`)}
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
