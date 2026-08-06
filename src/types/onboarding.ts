import type { NextStep } from "./api";

export type DisabilityType =
  | "AUTISM"
  | "INTELLECTUAL_DISABILITY"
  | "CEREBRAL_PALSY"
  | "ADHD"
  | "DEVELOPMENTAL_DELAY"
  | "LANGUAGE_DISORDER"
  | "ETC";

export type InterestCategory =
  | "WELFARE_SUBSIDY"
  | "HOSPITAL_HEALTH"
  | "PARENTING_COMMUNICATION"
  | "GROWTH_EDUCATION";

export type GuardianType = "PARENT" | "GRANDPARENT" | "SIBLING" | "ETC";

export type CommunityRoleType =
  | "INFO_SEEKER"
  | "EXPERIENCE_SHARER"
  | "WISDOM_HELPER";

export type Region = {
  regionId: number;
  regionLevel1: string;
  regionLevel2: string;
  fullName: string;
};

export type ChildProfileInput = {
  childName: string;
  birthYear: string;
  birthMonth: string;
  careAreas: string[];
  childKeywords: string;
};

export type InterestRegionInput = {
  interests: string[];
  sido: string;
  district: string;
};

export type GuardianProfileInput = {
  guardianNickname: string;
  guardianType: string;
  guardianRole: string;
};

export type ChildProfileRequest = {
  childNickname?: string;
  birth: string;
  disabilityTypes: DisabilityType[];
  keywordText?: string;
};

export type InterestRegionRequest = {
  interestCategories: InterestCategory[];
  regionId: number;
};

export type GuardianProfileRequest = {
  guardianNickname: string;
  guardianType?: GuardianType;
  communityRoleType?: CommunityRoleType;
};

export type OnboardingStepResponse = {
  step: number;
  completedStep: "CHILD_PROFILE" | "INTEREST_REGION" | "GUARDIAN_PROFILE";
  onboardingCompleted: boolean;
  nextStep: NextStep;
};

export type OnboardingStatusResponse = {
  childProfileRegistered: boolean;
  interestRegionRegistered: boolean;
  guardianProfileRegistered: boolean;
  onboardingCompleted: boolean;
  nextStep: NextStep;
};

export type OnboardingDraft = ChildProfileInput &
  InterestRegionInput &
  GuardianProfileInput;

export type OnboardingResume = {
  nextStep: NextStep;
  step: 1 | 2 | 3;
  form: OnboardingDraft;
};
