import refreshApi from "./refreshApi";

interface RefreshResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
  };
}

export default async function reissueTokens() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await refreshApi.post<RefreshResponse>(
      "/api/v1/auth/refresh",
      {
        refreshToken,
      },
    );

    return data.result;
  } catch (error) {
    console.error("토큰 재발급 요청에 실패했습니다.", error);
    return null;
  }
}