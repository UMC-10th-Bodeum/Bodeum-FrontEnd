import { clearAuthTokens, storeAuthTokens } from "./authStorage";
import refreshApi from "./refreshApi";
import type {
  RefreshResponse,
  ReissueAttempt,
  ReissuedTokens,
} from "@/types/auth";

let reissuePromise: Promise<ReissuedTokens | null> | null = null;

async function requestReissuedTokens(): Promise<ReissueAttempt> {
  const sourceRefreshToken = localStorage.getItem("refreshToken");

  if (!sourceRefreshToken) {
    return { sourceRefreshToken, tokens: null };
  }

  try {
    const { data } = await refreshApi.post<RefreshResponse>(
      "/api/v1/auth/refresh",
      {
        refreshToken: sourceRefreshToken,
      },
    );

    return { sourceRefreshToken, tokens: data.result };
  } catch (error) {
    console.error("토큰 재발급 요청에 실패했습니다.", error);
    return { sourceRefreshToken, tokens: null };
  }
}

export default function reissueTokens() {
  if (!reissuePromise) {
    reissuePromise = requestReissuedTokens()
      .then(({ sourceRefreshToken, tokens }) => {
        if (localStorage.getItem("refreshToken") !== sourceRefreshToken) {
          return null;
        }

        if (tokens) {
          storeAuthTokens(tokens);
        } else {
          clearAuthTokens();
        }

        return tokens;
      })
      .finally(() => {
        reissuePromise = null;
      });
  }

  return reissuePromise;
}
