import { resetAiChatSession } from "@/utils/aiChatSession";
import type { AuthTokens } from "@/types/auth";

export const AUTH_STATE_CHANGED_EVENT = "bodeum:auth-state-changed";

function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function storeAuthTokens(tokens: AuthTokens) {
  localStorage.setItem("tokenType", tokens.tokenType);
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  notifyAuthStateChanged();
}

export function clearAuthTokens() {
  localStorage.removeItem("tokenType");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  sessionStorage.removeItem("info-region-level1");
  sessionStorage.removeItem("info-region-level2");
  
  resetAiChatSession();
  notifyAuthStateChanged();
}

export function hasStoredAuthSession() {
  return Boolean(
    localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken"),
  );
}
