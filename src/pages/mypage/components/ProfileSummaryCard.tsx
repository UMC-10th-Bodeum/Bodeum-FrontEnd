import type { UserDashboard } from "@/types/mypage";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import SettingIcon from "@/assets/icons/Setting.svg?react";
import ButtonOutline from "@/components/ButtonOutline";
import { sidoDisplayNameByRegion } from "@/constants/regions";
import { myPageTabs } from "../myPageTabConfig";
import type { MyPageTabKey } from "@/types/mypage";

interface ProfileSummaryCardProps {
  dashboard: UserDashboard;
  counts: Record<MyPageTabKey, number>;
  onSettingsClick: () => void;
}

function getChildAge(birth: string | null | undefined) {
  const [birthYear = "", birthMonth = ""] = birth?.split("-") ?? [];

  if (!birthYear) {
    return null;
  }

  const today = new Date();
  const year = Number(birthYear);
  const month = Number(birthMonth);

  if (!Number.isFinite(year)) {
    return null;
  }

  const hasBirthdayPassed = !month || today.getMonth() + 1 >= month;

  return Math.max(0, today.getFullYear() - year - (hasBirthdayPassed ? 0 : 1));
}

export default function ProfileSummaryCard({
  dashboard,
  counts,
  onSettingsClick,
}: ProfileSummaryCardProps) {
  const diagnosisLabel =
    dashboard.childProfile?.disabilityTypes.map(({ label }) => label).join(", ") ||
    "집중 케어 미등록";
  const childAge = getChildAge(dashboard.childProfile?.birth);
  const district =
    dashboard.regionLevel2 !== dashboard.regionLevel1 ? dashboard.regionLevel2 : null;
  const region = [
    dashboard.regionLevel1
      ? (sidoDisplayNameByRegion[dashboard.regionLevel1] ?? dashboard.regionLevel1)
      : null,
    district,
  ]
    .filter(Boolean)
    .join(" ");
  const displayNickname = dashboard.nickname;

  return (
    <section className="w-[900px] rounded-[10px] bg-main-500 px-[40px] py-[28px] text-background-100">
      <div className="flex items-center">
        {dashboard.profileImageUrl ? (
          <img
            src={dashboard.profileImageUrl}
            alt="프로필"
            className="h-[90px] w-[90px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <ProfileIcon className="h-[90px] w-[90px] shrink-0" aria-label="보듬 부모님 프로필" />
        )}

        <div className="ml-[19px]">
          <h1 className="text-h1-onboard">{displayNickname}</h1>
          <p className="mt-[19px] text-h3-onboard">
            LEVEL {dashboard.level} · {diagnosisLabel} ·{" "}
            {childAge === null ? "연령 미등록" : `${childAge}세 아이`} · {region || "지역 미등록"}
          </p>
        </div>

        <ButtonOutline
          label="설정"
          icon={SettingIcon}
          iconPosition="left"
          onClick={onSettingsClick}
          className="ml-auto h-[44px] w-[160px] !text-h2-onboard"
        />
      </div>

      <div className="mt-[20px] h-px bg-background-400" />

      <div className="mt-[12px] flex gap-2">
        {myPageTabs.map((tab) => (
          <div key={tab.key} className="min-w-[68px] text-center">
            <strong className="block text-h1-onboard">{counts[tab.key]}</strong>
            <span className="mt-[11px] block text-h3-onboard">{tab.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
