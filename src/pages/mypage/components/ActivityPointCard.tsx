import BadgeIcon from "@/assets/icons/Badge.svg?react";
import BadgeHelpIcon from "@/assets/icons/BadgeHelp.svg?react";
import type { ActivityPointStat } from "../types";

interface ActivityPointCardProps {
  activities: ActivityPointStat[];
  onOpenBadgeGrade: () => void;
  onOpenBadgeHelp: () => void;
}

export default function ActivityPointCard({
  activities,
  onOpenBadgeGrade,
  onOpenBadgeHelp,
}: ActivityPointCardProps) {
  return (
    <aside>
      <section className="rounded-[8px] bg-white px-[16px] py-[12px]">
        <h2 className="text-h3-category-sub text-background-600">나의 활동(포인트)</h2>

        <div className="mt-[8px] flex flex-col gap-[8px]">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex h-[32px] w-[260px] items-center justify-between"
            >
              <span className="text-h4-list text-background-500">
                {activity.label} (+{activity.pointsPerAction}pt)
              </span>
              <span className="flex h-[32px] w-[137px] items-center rounded-[8px] bg-background-200 px-3 py-2 text-h4-list text-main-400">
                {activity.pointsPerAction * activity.count}
                <span className="text-background-600">pt · </span>
                {activity.count}
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
