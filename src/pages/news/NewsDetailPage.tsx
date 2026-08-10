import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { hasStoredAuthSession } from "@/apis/authApi";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import AIChatButton from "@/components/AIChatButton";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { useNewsDetail, useRelatedNews, useToggleNewsScrap } from "@/hooks/useNews";
import type { NewsType } from "@/types/news";

import { showToast } from "@/components/Toast";
import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { getNewsStatusPresentation } from "@/utils/newsStatus";

import { formatRegionDisplayLabel } from "@/constants/regions";
import NewsDetailHeader from "./components/NewsDetailHeader";
import ActivityInfoTable from "./components/ActivityInfoTable";
import RelatedNewsSection from "./components/RelatedNewsSection";

const breadcrumbLabelMap: Record<NewsType, string> = {
  ACTIVITY: "활동소식",
  LOCAL: "지역소식",
};

const getDisplayText = (value: string | null | undefined) => value?.trim() || null;

const formatPeriod = (startDate: string | null | undefined, endDate: string | null | undefined) =>
  [getDisplayText(startDate), getDisplayText(endDate)].filter(Boolean).join(" ~ ") || null;

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const [showLoginModal, setShowLoginModal] = useState(false);
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

  const status = news.status
    ? getNewsStatusPresentation(news.status, news.applyEndDate)
    : undefined;
  const regionLevel1Label =
    formatRegionDisplayLabel(news.region?.trim().split(/\s+/)[0] ?? "") || "해당 지역";

  const activityInfo = [
    ["진행기간", formatPeriod(news.programStartDate, news.programEndDate)],
    ["신청기간", formatPeriod(news.applyStartDate, news.applyEndDate)],
    ["지역", getDisplayText(news.region)],
    ["주관기관", getDisplayText(news.sourceName)],
    ["대상", getDisplayText(news.targetAudience)],
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
    navigate(`/news?${params.toString()}`);
  };

  const handleToggleScrap = () => {
    if (isScrapPending) {
      return;
    }

    if (!hasStoredAuthSession()) {
      setShowLoginModal(true);
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
          setShowLoginModal(true);
          return;
        }

        showToast("red", getApiErrorMessage(error, "스크랩 상태를 변경하지 못했습니다."));
      },
    });
  };

  return (
    <div className="min-h-full px-[32px] py-[20px]">
      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-[18px]">
        <div className="flex flex-col gap-[10px]">
          <NewsDetailHeader
            news={news}
            status={status}
            isScrapPending={isScrapPending}
            onToggleScrap={handleToggleScrap}
          />

          {activityInfo.length > 0 && <ActivityInfoTable items={activityInfo} />}
          <AIChatButton />

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
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]"
          onMouseDown={(event) => {
            const dialog = event.currentTarget.querySelector('[role="dialog"]');

            if (event.target instanceof Node && !dialog?.contains(event.target)) {
              setShowLoginModal(false);
            }
          }}
        >
          <OnboardCancelBox
            title="로그인하고 더 많은 기능을 이용해 보세요!"
            description={`회원가입 후 프로필을 등록하시면,\nAI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이\n자유롭게 이용하실 수 있습니다.`}
            leftButtonText="둘러보기"
            rightButtonText="로그인/회원가입"
            className="z-[70]!"
            onLeftButtonClick={() => navigate("/news")}
            onRightButtonClick={() => navigate("/auth")}
          />
        </div>
      )}
    </div>
  );
}
