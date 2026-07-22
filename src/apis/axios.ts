import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearAuthTokens, storeAuthTokens } from "./authStorage";
import reissueTokens from "./reissueTokens";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface TokenInfo {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<TokenInfo | null> | null = null;

function replaceLogoutRefreshToken(
  request: RetryRequestConfig,
  refreshToken: string,
) {
  if (!request.url?.endsWith("/api/v1/auth/logout") || !request.data) {
    return;
  }

  try {
    const requestData =
      typeof request.data === "string"
        ? JSON.parse(request.data)
        : { ...request.data };

    requestData.refreshToken = refreshToken;
    request.data =
      typeof request.data === "string"
        ? JSON.stringify(requestData)
        : requestData;
  } catch {
    request.data = JSON.stringify({ refreshToken });
  }
}

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_BASE_URL이 설정되지 않았습니다.");
}

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

  if (accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = reissueTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const newTokens = await refreshPromise;

      if (newTokens) {
        storeAuthTokens(newTokens);

        originalRequest.headers.Authorization =
          `${newTokens.tokenType} ${newTokens.accessToken}`;
        replaceLogoutRefreshToken(originalRequest, newTokens.refreshToken);

        return api(originalRequest);
      }

      clearAuthTokens();

      console.error("토큰 재발급에 실패했습니다.");
    }

    return Promise.reject(error);
  },
);

export default api;
