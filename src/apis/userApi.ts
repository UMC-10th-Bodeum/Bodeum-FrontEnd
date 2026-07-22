import api from "./axios";
import { clearAuthTokens, storeAuthTokens } from "./authStorage";
import type { ApiResponse } from "./apiTypes";
import reissueTokens from "./reissueTokens";

type RefreshedTokens = NonNullable<Awaited<ReturnType<typeof reissueTokens>>>;

let briefRefreshPromise: Promise<RefreshedTokens | null> | null = null;

export type CodeLabel = {
  code: string;
  label: string;
};

export type UserBrief = {
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  nickname: string | null;
  profileImageUrl: string | null;
  level: number | null;
  badgeName: string | null;
  childDisabilityTypes: CodeLabel[] | null;
  childAge: number | null;
  region: string | null;
};

export type UserProfile = {
  userId: number;
  nickname: string | null;
  profileImageUrl: string | null;
  point: number;
  level: number;
  badgeName: string | null;
  levelDescription: string | null;
  childProfile: {
    nickname: string | null;
    birth: string | null;
    disabilityTypes: CodeLabel[];
  } | null;
  keywordText: string | null;
  interestCategories: CodeLabel[];
  regionId: number | null;
  regionLevel1: string | null;
  regionLevel2: string | null;
  guardianNickname: string | null;
  guardianType: string | null;
  communityRoleType: string | null;
};

async function requestUserBrief() {
  const { data } = await api.get<ApiResponse<UserBrief>>(
    "/api/v1/users/me/brief",
  );

  return data.result;
}

function refreshBriefTokens() {
  if (!briefRefreshPromise) {
    briefRefreshPromise = reissueTokens().finally(() => {
      briefRefreshPromise = null;
    });
  }

  return briefRefreshPromise;
}

export async function getUserBrief() {
  const brief = await requestUserBrief();

  if (brief.isLoggedIn || !localStorage.getItem("refreshToken")) {
    return brief;
  }

  const refreshedTokens = await refreshBriefTokens();

  if (!refreshedTokens) {
    clearAuthTokens();
    return brief;
  }

  storeAuthTokens(refreshedTokens);
  return requestUserBrief();
}

export async function getMyProfile() {
  const { data } = await api.get<ApiResponse<UserProfile>>(
    "/api/v1/users/me/profile",
  );

  return data.result;
}

export async function withdrawCurrentUser(reason?: string) {
  const trimmedReason = reason?.trim();
  const { data } = await api.delete<ApiResponse<{ success: boolean }>>(
    "/api/v1/users/me",
    {
      data: trimmedReason ? { reason: trimmedReason } : undefined,
    },
  );

  return data.result;
}
