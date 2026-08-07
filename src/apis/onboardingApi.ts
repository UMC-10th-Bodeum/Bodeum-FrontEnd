import api from "./axios";
import { getMyProfile } from "./userApi";
import type { ApiResponse } from "@/types/api";
import type {
  ChildProfileInput,
  GuardianProfileInput,
  InterestRegionInput,
  OnboardingResume,
  OnboardingStatusResponse,
  OnboardingStepResponse,
  Region,
} from "@/types/onboarding";
import {
  buildChildProfileRequest,
  buildGuardianProfileRequest,
  buildInterestRegionRequest,
  buildOnboardingDraft,
  createEmptyOnboardingDraft,
  findRegionId,
  resolveOnboardingStep,
} from "@/utils/onboarding";

export async function getRegions() {
  const { data } = await api.get<ApiResponse<Region[]>>("/api/v1/regions");

  return data.result;
}

export async function getOnboardingResume(options?: {
  allowResolved?: boolean;
  status?: OnboardingStatusResponse;
}): Promise<OnboardingResume> {
  const status = options?.status ?? (await getOnboardingStatus());

  if (status.nextStep === "TERMS") {
    return {
      nextStep: "TERMS",
      step: resolveOnboardingStep(status),
      form: createEmptyOnboardingDraft(),
    };
  }

  if (status.nextStep !== "ONBOARDING" && !options?.allowResolved) {
    return {
      nextStep: status.nextStep,
      step: resolveOnboardingStep(status),
      form: createEmptyOnboardingDraft(),
    };
  }

  const profile = await getMyProfile();

  return {
    nextStep: "ONBOARDING",
    step: resolveOnboardingStep(status),
    form: buildOnboardingDraft(profile),
  };
}

export async function getOnboardingStatus() {
  const { data } = await api.get<
    ApiResponse<OnboardingStatusResponse>
  >("/api/v1/users/me/onboarding-status");

  return data.result;
}

export async function registerChildProfile(input: ChildProfileInput) {
  const { data } = await api.post<ApiResponse<OnboardingStepResponse>>(
    "/api/v1/onboarding/child-profile",
    buildChildProfileRequest(input),
  );

  return data.result;
}

export async function registerInterestRegion(
  input: InterestRegionInput,
  cachedRegions?: Region[],
) {
  const regions = cachedRegions ?? (await getRegions());
  const regionId = findRegionId(regions, input.sido, input.district);

  if (regionId === undefined) {
    throw new Error("선택한 지역을 서버 지역 목록에서 찾지 못했습니다.");
  }

  const { data } = await api.post<ApiResponse<OnboardingStepResponse>>(
    "/api/v1/onboarding/interest-region",
    buildInterestRegionRequest(input, regionId),
  );

  return data.result;
}

export async function registerGuardianProfile(input: GuardianProfileInput) {
  const { data } = await api.post<ApiResponse<OnboardingStepResponse>>(
    "/api/v1/onboarding/guardian-profile",
    buildGuardianProfileRequest(input),
  );

  return data.result;
}

export async function skipOnboarding() {
  const { data } = await api.post<ApiResponse<OnboardingStatusResponse>>(
    "/api/v1/onboarding/skip",
  );

  return data.result;
}

export async function quitOnboarding() {
  const { data } = await api.post<ApiResponse<OnboardingStatusResponse>>(
    "/api/v1/onboarding/quit",
  );

  return data.result;
}
