import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import AIChatButton from "@/components/AIChatButton";
import { useNewsDetail, useRelatedNews, useToggleNewsScrap } from "@/hooks/useNews";
import type { NewsType } from "@/types/news";

import { showToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/apis/apiError";
import { getNewsStatusPresentation } from "@/utils/newsStatus";

import { formatRegionDisplayLabel } from "@/constants/regions";
import NewsDetailHeader from "./components/NewsDetailHeader";
import ActivityInfoTable from "./components/ActivityInfoTable";
import RelatedNewsSection from "./components/RelatedNewsSection";

const breadcrumbLabelMap: Record<NewsType, string> = {
  ACTIVITY: "활동소식",
  LOCAL: "지역소식",
};

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

  const activityInfo: [string, string][] = [
    ["진행기간", `${news?.programStartDate ?? "-"} ~ ${news?.programEndDate ?? "-"}`],
    ["신청기간", `${news?.applyStartDate ?? "-"} ~ ${news?.applyEndDate ?? "-"}`],
    ["지역", news?.region || "-"],
    ["주관기관", news?.sourceName || "-"],
    ["대상", news?.targetAudience || "-"],
    ["문의", news?.contact || "-"],
    ["담당자", news?.manager || "-"],
    ["게시일", news?.publishedAt || "-"],
  ];

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
          <NewsDetailHeader
            news={news}
            status={status}
            isScrapPending={isScrapPending}
            onToggleScrap={handleToggleScrap}
          />

          <ActivityInfoTable items={activityInfo} />

          <div className="py-[20px]">
            <RelatedNewsSection
              title={`${regionLevel1Label}에서 모집 중인 소식`}
              items={relatedNews}
              isPending={isRelatedNewsPending}
              isError={isRelatedNewsError}
              onMoreClick={handleRelatedNewsMoreClick}
            />
          </div>
        </div>

        <AIChatButton />
      </div>
    </div>
  );
}
