import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/apis/apiError";
import { useMyDashboard, useMyPoints } from "@/hooks/useMyPage";
import type { MyPageTabKey } from "@/types/mypage";
import ActivityPointCard from "./components/ActivityPointCard";
import BadgeGradeModal from "./components/BadgeGradeModal";
import BadgeHelpModal from "./components/BadgeHelpModal";
import MyPageActivitySection from "./components/MyPageActivitySection";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import AsyncState from "@/components/AsyncState";

type BadgeModalType = "grade" | "help" | null;

export default function MyPage() {
  const navigate = useNavigate();
  const dashboardQuery = useMyDashboard();
  const pointsQuery = useMyPoints();
  const [badgeModal, setBadgeModal] = useState<BadgeModalType>(null);

  if (dashboardQuery.isPending) {
    return (
      <AsyncState
        type="loading"
        variant="section"
        loadingText="마이페이지 정보를 불러오는 중입니다."
        className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-background-200 text-h3-onboard text-background-500"
        textClassName=""
      />
    );
  }

  if (dashboardQuery.isError) {
    return (
      <AsyncState
        type="error"
        variant="section"
        errorText={getApiErrorMessage(
          dashboardQuery.error,
          "마이페이지 정보를 불러오지 못했습니다.",
        )}
        className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-[16px] bg-background-200 text-h3-onboard text-background-500"
        textClassName=""
      />
    );
  }

  const dashboard = dashboardQuery.data;
  const counts: Record<MyPageTabKey, number> = {
    saved: dashboard.activitySummary.savedInfoCount,
    posts: dashboard.activitySummary.myPostCount,
    comments: dashboard.activitySummary.myCommentCount,
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto w-[896px]">
        <ProfileSummaryCard
          dashboard={dashboard}
          counts={counts}
          onSettingsClick={() => navigate("/mypage/settings")}
        />

        <div className="mt-[18px] grid grid-cols-[576px_299px] gap-x-[18px] gap-y-[16px]">
          <MyPageActivitySection counts={counts} />

          <div className="col-start-2 row-start-2 self-start">
            <ActivityPointCard
              totalPoint={pointsQuery.data?.totalPoint ?? dashboard.point}
              activities={pointsQuery.data?.activities ?? []}
              isLoading={pointsQuery.isPending}
              errorMessage={
                pointsQuery.isError
                  ? getApiErrorMessage(pointsQuery.error, "포인트 내역을 불러오지 못했습니다.")
                  : undefined
              }
              onRetry={() => void pointsQuery.refetch()}
              onOpenBadgeGrade={() => setBadgeModal("grade")}
              onOpenBadgeHelp={() => setBadgeModal("help")}
            />
          </div>
        </div>
      </div>

      {badgeModal === "grade" && <BadgeGradeModal onClose={() => setBadgeModal(null)} />}
      {badgeModal === "help" && <BadgeHelpModal onClose={() => setBadgeModal(null)} />}
    </div>
  );
}
