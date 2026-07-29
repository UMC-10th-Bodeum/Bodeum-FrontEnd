import api from "./axios";
import type { ApiResponse } from "./apiTypes";
import reissueTokens from "./reissueTokens";

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
  email: string | null;
  provider: string;
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
  joinedAt: string;
  updatedAt: string;
};

export type UserWithdrawResult = {
  success: boolean;
};

async function requestUserBrief() {
  const { data } = await api.get<ApiResponse<UserBrief>>(
    "/api/v1/users/me/brief",
  );

  return data.result;
}

export async function getUserBrief() {
  const brief = await requestUserBrief();

  if (brief.isLoggedIn || !localStorage.getItem("refreshToken")) {
    return brief;
  }

  const refreshedTokens = await reissueTokens();

  if (!refreshedTokens) {
    return brief;
  }

  return requestUserBrief();
}

export async function getMyProfile() {
  const { data } = await api.get<ApiResponse<UserProfile>>(
    "/api/v1/users/me/profile",
  );

  return data.result;
}

export async function withdrawCurrentUser() {
  const { data } = await api.delete<ApiResponse<UserWithdrawResult>>(
    "/api/v1/users/me",
  );

  return data.result;
}
