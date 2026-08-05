import api from "./axios";
import reissueTokens from "./reissueTokens";
import type { ApiResponse } from "@/types/api";
import type { UserBrief, UserProfile } from "@/types/user";

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
