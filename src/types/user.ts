export type CodeLabel = {
  code: string;
  label: string;
};

export type UserBrief = {
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  nickname: string | null;
  profileImageUrl: string | null;
  level: number | null;
  badgeName: string | null;
  childDisabilityTypes: CodeLabel[] | null;
  childAge: number | null;
  region: string | null;
};

export type UserProfile = {
  userId: number;
  nickname: string;
  email: string | null;
  provider: string;
  profileImageUrl: string | null;
  point: number;
  level: number;
  badgeName: string;
  levelDescription: string | null;
  childProfile: {
    nickname: string | null;
    birth: string | null;
    disabilityTypes: CodeLabel[];
  } | null;
  keywordText: string | null;
  interestCategories: CodeLabel[];
  regionId: number | null;
  regionLevel1: string | null;
  regionLevel2: string | null;
  guardianNickname: string | null;
  guardianType: string | null;
  communityRoleType: string | null;
  joinedAt: string;
  updatedAt: string;
};

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
