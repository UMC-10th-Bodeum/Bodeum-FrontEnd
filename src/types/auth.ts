import type { NextStep } from "./api";

export type SocialProvider = "naver" | "kakao";

export type AgreementFormValues = {
  terms: boolean;
  privacy: boolean;
  ai: boolean;
};

export type AgreementRequest = {
  serviceTermsAgreed: boolean;
  privacyPolicyAgreed: boolean;
  aiTermsAgreed: boolean;
};

export type AgreementResponse = AgreementRequest & {
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

export type LogoutCurrentUserOptions = {
  clearImmediately?: boolean;
};

export type AuthTokens = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export interface RefreshResponse {
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

export type ReissuedTokens = RefreshResponse["result"];

export type ReissueAttempt = {
  sourceRefreshToken: string | null;
  tokens: ReissuedTokens | null;
};
