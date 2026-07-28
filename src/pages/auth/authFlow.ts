import type { NextStep } from "@/apis/apiTypes";

export type AuthFlow = "login" | "agreement" | "onboarding";

type ResolveAuthPageFlowOptions = {
  requestedFlow: AuthFlow;
  storedNextStep: NextStep | null;
  isProfileOnboardingRequested: boolean;
};

type ProfileOnboardingStatus = {
  nextStep: NextStep;
  childProfileRegistered: boolean;
  interestRegionRegistered: boolean;
  guardianProfileRegistered: boolean;
};

export type ProfileOnboardingDestination =
  | "agreement"
  | "onboarding"
  | "profile"
  | "home";

export function resolveRequestedAuthFlow(value: string | null): AuthFlow {
  if (value === "agreement" || value === "onboarding") {
    return value;
  }

  return "login";
}

export function resolvePostLoginNextStep({
  agreementCompleted,
  nextStep,
}: {
  agreementCompleted: boolean;
  nextStep: NextStep;
}): NextStep {
  return agreementCompleted ? nextStep : "TERMS";
}

export function resolveAuthPageFlow({
  requestedFlow,
  storedNextStep,
  isProfileOnboardingRequested,
}: ResolveAuthPageFlowOptions): AuthFlow {
  if (isProfileOnboardingRequested) {
    return "onboarding";
  }

  if (storedNextStep === "TERMS") {
    return "agreement";
  }

  if (storedNextStep === "ONBOARDING") {
    return "onboarding";
  }

  return requestedFlow;
}

export function resolveProfileOnboardingDestination({
  nextStep,
  childProfileRegistered,
  interestRegionRegistered,
  guardianProfileRegistered,
}: ProfileOnboardingStatus): ProfileOnboardingDestination {
  if (nextStep === "TERMS") {
    return "agreement";
  }

  if (nextStep === "ONBOARDING") {
    return "onboarding";
  }

  const hasIncompleteProfile =
    !childProfileRegistered ||
    !interestRegionRegistered ||
    !guardianProfileRegistered;

  return hasIncompleteProfile ? "profile" : "home";
}
