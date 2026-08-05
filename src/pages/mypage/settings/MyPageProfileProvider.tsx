import { useState, type ReactNode } from "react";
import { getApiErrorMessage } from "@/apis/apiError";
import { useMyProfile } from "@/hooks/useMyPage";
import { MyPageProfileContext } from "./myPageProfileContext";
import { cloneProfileSettings, toProfileSettings } from "./profileSettingsMapper";
import type { ProfileSettingsForm } from "@/types/mypage";

export default function MyPageProfileProvider({ children }: { children: ReactNode }) {
  const [savedProfile, setSavedProfile] = useState<ProfileSettingsForm | null>(null);
  const profileQuery = useMyProfile();

  const saveProfile = (nextProfile: ProfileSettingsForm) => {
    setSavedProfile(cloneProfileSettings(nextProfile));
  };

  if (profileQuery.isPending) {
    return (
      <div
        role="status"
        className="flex min-h-full items-center justify-center bg-background-200 text-h3-onboard text-background-500"
      >
        프로필 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div
        role="alert"
        className="flex min-h-full flex-col items-center justify-center gap-[16px] bg-background-200 text-h3-onboard text-background-500"
      >
        <p>{getApiErrorMessage(profileQuery.error, "프로필을 불러오지 못했습니다.")}</p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="cursor-pointer rounded-[10px] bg-main-400 px-[16px] py-[10px] text-background-100"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const profile = savedProfile ?? toProfileSettings(profileQuery.data);

  return (
    <MyPageProfileContext.Provider
      value={{
        profile,
        level: profileQuery.data.level,
        joinedAt: profileQuery.data.joinedAt,
        guardianType: profileQuery.data.guardianType,
        badgeName: profileQuery.data.badgeName,
        saveProfile,
      }}
    >
      {children}
    </MyPageProfileContext.Provider>
  );
}
