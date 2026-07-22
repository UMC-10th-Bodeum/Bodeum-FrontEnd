import axios, { type InternalAxiosRequestConfig } from "axios";
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

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_BASE_URL이 설정되지 않았습니다.");
}

const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

  if (accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
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
        localStorage.setItem("tokenType", newTokens.tokenType);
        localStorage.setItem("accessToken", newTokens.accessToken);
        localStorage.setItem("refreshToken", newTokens.refreshToken);

        originalRequest.headers.Authorization =
          `${newTokens.tokenType} ${newTokens.accessToken}`;

        return apiClient(originalRequest);
      }

      localStorage.removeItem("tokenType");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.error("토큰 재발급에 실패했습니다.");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;