import ProfileIcon from "@/assets/icons/Profile.svg?react";
import SettingIcon from "@/assets/icons/Setting.svg?react";
import ButtonOutline from "@/components/ButtonOutline";
import { myPageTabs } from "../data/myPageData";
import type { MyPageTabKey } from "../types";

interface ProfileSummaryCardProps {
  counts: Record<MyPageTabKey, number>;
  onSettingsClick: () => void;
}

export default function ProfileSummaryCard({ counts, onSettingsClick }: ProfileSummaryCardProps) {
  return (
    <section className="w-[900px] rounded-[10px] bg-main-500 px-[40px] py-[28px] text-background-100">
      <div className="flex items-center">
        <ProfileIcon className="h-[90px] w-[90px] shrink-0" aria-label="보듬 부모님 프로필" />

        <div className="ml-[19px]">
          <h1 className="text-h1-onboard">보듬 부모님</h1>
          <p className="mt-[19px] text-h3-onboard">
            LEVEL 1 · 자폐스펙트럼 · N세 아이 · 서울 강남구
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
