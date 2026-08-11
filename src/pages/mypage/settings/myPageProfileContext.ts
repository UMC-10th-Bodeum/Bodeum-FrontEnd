import { createContext, useContext } from "react";
import type { ProfileSettingsForm } from "@/types/mypage";

export interface MyPageProfileContextValue {
  profile: ProfileSettingsForm;
  level: number | null;
  joinedAt: string;
  guardianType: string | null;
  badgeName: string;
  saveProfile: (profile: ProfileSettingsForm) => void;
}

export const MyPageProfileContext = createContext<MyPageProfileContextValue | null>(null);

export function useMyPageProfile() {
  const context = useContext(MyPageProfileContext);

  if (!context) {
    throw new Error("MyPageProfileProvider가 필요합니다.");
  }

  return context;
}
