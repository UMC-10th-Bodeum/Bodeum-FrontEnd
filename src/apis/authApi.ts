import api from "./axios";
import { clearAuthTokens } from "./authStorage";
import type { ApiResponse, NextStep } from "./apiTypes";
import refreshApi from "./refreshApi";

export {
  AUTH_STATE_CHANGED_EVENT,
  clearAuthTokens,
  storeAuthTokens,
} from "./authStorage";

export type SocialProvider = "naver" | "kakao";

export type AgreementFormValues = {
  terms: boolean;
  privacy: boolean;
  ai: boolean;
};

type AgreementRequest = {
  serviceTermsAgreed: boolean;
  privacyPolicyAgreed: boolean;
  aiTermsAgreed: boolean;
};

type AgreementResponse = AgreementRequest & {
  aiTermsAgreedAt: string | null;
  agreedAt: string;
  nextStep: NextStep;
};

export type AuthLoginResult = {
  userId: number;
  provider: SocialProvider;
  nickname: string;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  isNewUser: boolean;
  agreementCompleted: boolean;
  onboardingCompleted: boolean;
  nextStep: NextStep;
};

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_BASE_URL이 설정되지 않았습니다.");
}

export function getSocialLoginUrl(provider: SocialProvider) {
  return `${baseUrl.replace(/\/+$/, "")}/api/v1/auth/login/${provider}`;
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

export async function logoutCurrentUser() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await api.post<ApiResponse<null>>("/api/v1/auth/logout", {
        refreshToken,
      });
    }
  } finally {
    clearAuthTokens();
  }
}
