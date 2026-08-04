import BadgeIcon from "@/assets/icons/Badge.svg?react";
import BadgeHelpIcon from "@/assets/icons/BadgeHelp.svg?react";
import type { UserPointActivity } from "@/apis/userApi";

interface ActivityPointCardProps {
  totalPoint: number;
  activities: UserPointActivity[];
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onOpenBadgeGrade: () => void;
  onOpenBadgeHelp: () => void;
}

export default function ActivityPointCard({
  totalPoint,
  activities,
  isLoading,
  errorMessage,
  onRetry,
  onOpenBadgeGrade,
  onOpenBadgeHelp,
}: ActivityPointCardProps) {
  return (
    <aside>
      <section className="rounded-[8px] bg-white px-[16px] py-[12px]">
        <h2 className="text-h3-category-sub text-background-600">나의 활동(포인트)</h2>
        <p className="mt-[4px] text-h4-list text-main-400">총 {totalPoint}pt</p>

        <div className="mt-[8px] flex flex-col gap-[8px]">
          {isLoading && (
            <p className="py-[12px] text-center text-h4-list text-background-500">
              포인트 내역을 불러오는 중입니다.
            </p>
          )}

          {errorMessage && (
            <div className="flex flex-col items-center gap-[8px] py-[12px] text-h4-list text-background-500">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer text-main-400 underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && activities.map((activity) => (
            <div
              key={activity.pointType}
              className="flex h-[32px] w-[260px] items-center justify-between"
            >
              <span className="text-h4-list text-background-500">
                {activity.label} (+{activity.pointPerAction}pt)
              </span>
              <span className="flex h-[32px] w-[137px] items-center rounded-[8px] bg-background-200 px-3 py-2 text-h4-list text-main-400">
                {activity.earnedPoint}
                <span className="text-background-600">pt · </span>
                {activity.activityCount}
                <span className="text-background-600">회</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-[13px] grid grid-cols-2 gap-[11px]">
        <button
          type="button"
          onClick={onOpenBadgeGrade}
          className="flex h-[72px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[8px] bg-main-200 text-h3-category-sub text-background-600 transition-shadow hover:shadow-button"
        >
          <BadgeIcon className="h-[20px] w-[20px]" aria-hidden="true" />
          보듬 뱃지 등급 안내
        </button>
        <button
          type="button"
          onClick={onOpenBadgeHelp}
          className="flex h-[72px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[8px] bg-main-200 text-h3-category-sub text-background-600 transition-shadow hover:shadow-button"
        >
          <BadgeHelpIcon className="h-[24px] w-[24px]" aria-hidden="true" />
          보듬 뱃지란?
        </button>
      </div>
    </aside>
  );
}
