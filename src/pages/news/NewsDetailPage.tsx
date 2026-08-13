import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { hasStoredAuthSession } from "@/apis/authApi";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import AIChatButton from "@/components/AIChatButton";
import { useNews, useNewsDetail, useToggleNewsScrap } from "@/hooks/useNews";
import type { NewsType } from "@/types/news";

import { showToast } from "@/components/Toast";
import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { getNewsStatusPresentation } from "@/utils/newsStatus";

import { formatRegionDisplayLabel } from "@/constants/regions";
import NewsDetailHeader from "./components/detail/NewsDetailHeader";
import ActivityInfoTable from "./components/detail/ActivityInfoTable";
import RelatedNewsSection from "./components/detail/RelatedNewsSection";

const breadcrumbLabelMap: Record<NewsType, string> = {
  ACTIVITY: "활동소식",
  LOCAL: "지역소식",
};

const getDisplayText = (value: string | null | undefined) => value?.trim() || null;

const formatTargetAudience = (value: string | null | undefined) =>
  getDisplayText(value)
    ?.replace(/\s*\|\s*/g, "\n")
    .replace(/\s*\+\s*/g, ", ") ?? null;

const formatPeriod = (startDate: string | null | undefined, endDate: string | null | undefined) =>
  [getDisplayText(startDate), getDisplayText(endDate)].filter(Boolean).join(" ~ ") || null;

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const parsedNewsId = Number(id);
  const newsId = Number.isSafeInteger(parsedNewsId) && parsedNewsId > 0 ? parsedNewsId : undefined;
  const { data: news, isPending, isError } = useNewsDetail(newsId);
  const relatedRegionLevel1 = news?.region?.trim().split(/\s+/)[0];
  const relatedNewsQuery = useNews(
    {
      page: 0,
      size: 14,
      sort: "VIEW",
      newsType: news?.newsType,
      regionLevel1: relatedRegionLevel1,
      category: news?.categoryCode,
    },
    Boolean(news && relatedRegionLevel1),
  );
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleNewsScrap();

  const breadcrumbLabel = news ? breadcrumbLabelMap[news.newsType] : "소식";
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

  const status = news.status
    ? getNewsStatusPresentation(news.status, news.applyEndDate)
    : undefined;
  const regionLevel1Label =
    formatRegionDisplayLabel(news.region?.trim().split(/\s+/)[0] ?? "") || "해당 지역";
  const relatedNews = Array.from(
    new Map(
      (relatedNewsQuery.data?.items ?? [])
        .filter((item) => item.newsId !== news.newsId)
        .map((item) => [item.newsId, { ...item, region: item.region ?? "" }] as const),
    ).values(),
  ).slice(0, 5);

  const activityInfo = [
    ["진행기간", formatPeriod(news.programStartDate, news.programEndDate)],
    ["신청기간", formatPeriod(news.applyStartDate, news.applyEndDate)],
    ["지역", getDisplayText(news.region)],
    ["주관기관", getDisplayText(news.sourceName)],
    ["대상", formatTargetAudience(news.targetAudience)],
    ["문의", getDisplayText(news.contact)],
    ["담당자", getDisplayText(news.manager)],
    ["게시일", getDisplayText(news.publishedAt)],
  ].filter((item): item is [string, string] => item[1] !== null);

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
    params.set("category", news.categoryCode);
    navigate(`/news?${params.toString()}`);
  };

  const handleToggleScrap = () => {
    if (isScrapPending) {
      return;
    }

    if (!hasStoredAuthSession()) {
      showToast("blue", "로그인/회원가입 후 만나보세요");
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
        if (isUnauthorizedError(error)) {
          showToast("blue", "로그인/회원가입 후 만나보세요");
          return;
        }

        showToast("red", getApiErrorMessage(error, "스크랩 상태를 변경하지 못했습니다."));
      },
    });
  };

  return (
    <div className="min-h-full px-[32px] py-[20px]">
      <div className="mx-auto flex w-[680px] flex-col gap-[18px]">
        <div className="flex flex-col gap-[10px]">
          <NewsDetailHeader
            news={news}
            status={status}
            isScrapPending={isScrapPending}
            onToggleScrap={handleToggleScrap}
          />

          {activityInfo.length > 0 && <ActivityInfoTable items={activityInfo} />}
          <AIChatButton />

          <div className="pt-[20px]">
            <RelatedNewsSection
              title={`${regionLevel1Label}에서 모집중인 소식`}
              items={relatedNews}
              isPending={Boolean(relatedRegionLevel1) && relatedNewsQuery.isPending}
              isError={relatedNewsQuery.isError}
              onMoreClick={handleRelatedNewsMoreClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
