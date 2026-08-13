import api from "./axios";
import { clearAuthTokens } from "./authStorage";
import refreshApi from "./refreshApi";
import type { ApiResponse } from "@/types/api";
import type {
  AgreementFormValues,
  AgreementRequest,
  AgreementResponse,
  AuthLoginResult,
  LogoutCurrentUserOptions,
  SocialProvider,
} from "@/types/auth";

export {
  AUTH_STATE_CHANGED_EVENT,
  clearAuthTokens,
  hasStoredAuthSession,
  storeAuthTokens,
} from "./authStorage";

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_BASE_URL이 설정되지 않았습니다.");
}

export function getSocialLoginUrl(provider: SocialProvider) {
  const loginUrl = new URL(
    `${baseUrl.replace(/\/+$/, "")}/api/v1/auth/login/${provider}`,
  );

  loginUrl.searchParams.set(
    "frontCallbackUrl",
    `${window.location.origin}/auth/callback`,
  );

  return loginUrl.toString();
}

export function startSocialLogin(provider: SocialProvider) {
  window.location.assign(getSocialLoginUrl(provider));
}

export async function exchangeSocialLoginCode(code: string) {
  const { data } = await refreshApi.post<ApiResponse<AuthLoginResult>>(
    "/api/v1/auth/exchange",
    { code },
  );

  return data.result;
}

export async function submitAgreements(values: AgreementFormValues) {
  const request: AgreementRequest = {
    serviceTermsAgreed: values.terms,
    privacyPolicyAgreed: values.privacy,
    aiTermsAgreed: values.ai,
  };
  const { data } = await api.post<ApiResponse<AgreementResponse>>(
    "/api/v1/users/me/agreements",
    request,
  );

  return data.result;
}

export async function logoutCurrentUser(
  options: LogoutCurrentUserOptions = {},
) {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

  if (options.clearImmediately) {
    clearAuthTokens();
  }

  const logoutRequest = refreshToken
    ? api.post<ApiResponse<null>>(
        "/api/v1/auth/logout",
        { refreshToken },
        {
          headers: accessToken
            ? { Authorization: `${tokenType} ${accessToken}` }
            : undefined,
        },
      )
    : null;

  try {
    if (logoutRequest) {
      await logoutRequest;
    }
  } finally {
    if (!options.clearImmediately) {
      clearAuthTokens();
    }
  }
}
