import type {
  ChildProfileInput,
  ChildProfileRequest,
  CommunityRoleType,
  DisabilityType,
  GuardianProfileInput,
  GuardianProfileRequest,
  GuardianType,
  InterestCategory,
  InterestRegionInput,
  InterestRegionRequest,
  OnboardingDraft,
  OnboardingStatusResponse,
  Region,
} from "@/types/onboarding";
import type { UserProfile } from "@/types/user";

const disabilityTypeByLabel: Record<string, DisabilityType> = {
  자폐스펙트럼: "AUTISM",
  지적장애: "INTELLECTUAL_DISABILITY",
  뇌병변장애: "CEREBRAL_PALSY",
  ADHD: "ADHD",
  발달지연: "DEVELOPMENTAL_DELAY",
  언어장애: "LANGUAGE_DISORDER",
  기타: "ETC",
};

const interestCategoryByLabel: Record<string, InterestCategory> = {
  "맞춤 복지·지원금": "WELFARE_SUBSIDY",
  "안심 병원·건강": "HOSPITAL_HEALTH",
  "육아 상담·소통": "PARENTING_COMMUNICATION",
  "성장·교육": "GROWTH_EDUCATION",
};

const guardianTypeByLabel: Record<string, GuardianType> = {
  부모: "PARENT",
  조부모: "GRANDPARENT",
  "형제·자매": "SIBLING",
  기타: "ETC",
};

const communityRoleByLabel: Record<string, CommunityRoleType> = {
  "[정보 탐색자] : 기초 정보와 가이드가 필요한 단계": "INFO_SEEKER",
  "[경험 공유자] : 이웃과 가벼운 팁을 주고받고 싶은 단계":
    "EXPERIENCE_SHARER",
  "[지혜 조력자] : 나만의 노하우를 적극적으로 나누고 싶은 단계":
    "WISDOM_HELPER",
};

const disabilityLabelByType: Record<DisabilityType, string> = {
  AUTISM: "자폐스펙트럼",
  INTELLECTUAL_DISABILITY: "지적장애",
  CEREBRAL_PALSY: "뇌병변장애",
  ADHD: "ADHD",
  DEVELOPMENTAL_DELAY: "발달지연",
  LANGUAGE_DISORDER: "언어장애",
  ETC: "기타",
};

const interestLabelByCategory: Record<InterestCategory, string> = {
  WELFARE_SUBSIDY: "맞춤 복지·지원금",
  HOSPITAL_HEALTH: "안심 병원·건강",
  PARENTING_COMMUNICATION: "육아 상담·소통",
  GROWTH_EDUCATION: "성장·교육",
};

const guardianLabelByType: Record<GuardianType, string> = {
  PARENT: "부모",
  GRANDPARENT: "조부모",
  SIBLING: "형제·자매",
  ETC: "기타",
};

const communityRoleLabelByType: Record<CommunityRoleType, string> = {
  INFO_SEEKER: "[정보 탐색자] : 기초 정보와 가이드가 필요한 단계",
  EXPERIENCE_SHARER:
    "[경험 공유자] : 이웃과 가벼운 팁을 주고받고 싶은 단계",
  WISDOM_HELPER:
    "[지혜 조력자] : 나만의 노하우를 적극적으로 나누고 싶은 단계",
};

export function createEmptyOnboardingDraft(): OnboardingDraft {
  return {
    childName: "",
    birthYear: "",
    birthMonth: "",
    careAreas: [],
    childKeywords: "",
    interests: [],
    sido: "",
    district: "",
    guardianNickname: "",
    guardianType: "",
    guardianRole: "",
  };
}

export function resolveOnboardingStep(
  status: OnboardingStatusResponse,
): 1 | 2 | 3 {
  if (!status.childProfileRegistered) {
    return 1;
  }

  if (!status.interestRegionRegistered) {
    return 2;
  }

  return 3;
}

export function buildOnboardingDraft(profile: UserProfile): OnboardingDraft {
  const [birthYear = "", birthMonth = ""] =
    profile.childProfile?.birth?.split("-") ?? [];
  const sido = profile.regionLevel1 ?? "";
  const district =
    profile.regionLevel2 && profile.regionLevel2 !== sido
      ? profile.regionLevel2
      : "";

  return {
    childName: profile.childProfile?.nickname ?? "",
    birthYear,
    birthMonth: birthMonth.replace(/^0/, ""),
    careAreas: (profile.childProfile?.disabilityTypes ?? []).map(
      ({ code, label }) =>
        disabilityLabelByType[code as DisabilityType] ?? label,
    ),
    childKeywords: profile.keywordText ?? "",
    interests: (profile.interestCategories ?? []).map(
      ({ code, label }) =>
        interestLabelByCategory[code as InterestCategory] ?? label,
    ),
    sido,
    district,
    guardianNickname: profile.guardianNickname ?? "",
    guardianType: profile.guardianType
      ? (guardianLabelByType[profile.guardianType as GuardianType] ?? "")
      : "",
    guardianRole: profile.communityRoleType
      ? (communityRoleLabelByType[
          profile.communityRoleType as CommunityRoleType
        ] ?? "")
      : "",
  };
}

function mapRequiredValues<T extends string>(
  values: string[],
  valueMap: Record<string, T>,
  fieldName: string,
) {
  return values.map((value) => {
    const mappedValue = valueMap[value];

    if (!mappedValue) {
      throw new Error(`${fieldName} 값을 서버 형식으로 변환하지 못했습니다.`);
    }

    return mappedValue;
  });
}

function mapOptionalValue<T extends string>(
  value: string,
  valueMap: Record<string, T>,
  fieldName: string,
) {
  if (!value) {
    return undefined;
  }

  const mappedValue = valueMap[value];

  if (!mappedValue) {
    throw new Error(`${fieldName} 값을 서버 형식으로 변환하지 못했습니다.`);
  }

  return mappedValue;
}

export function buildChildProfileRequest(
  input: ChildProfileInput,
): ChildProfileRequest {
  const childNickname = input.childName.trim();
  const keywordText = input.childKeywords.trim();

  return {
    childNickname: childNickname || undefined,
    birth: `${input.birthYear}-${input.birthMonth.padStart(2, "0")}`,
    disabilityTypes: mapRequiredValues(
      input.careAreas,
      disabilityTypeByLabel,
      "집중 케어 영역",
    ),
    keywordText: keywordText || undefined,
  };
}

export function buildInterestRegionRequest(
  input: InterestRegionInput,
  regionId: number,
): InterestRegionRequest {
  return {
    interestCategories: mapRequiredValues(
      input.interests,
      interestCategoryByLabel,
      "관심사",
    ),
    regionId,
  };
}

export function buildGuardianProfileRequest(
  input: GuardianProfileInput,
): GuardianProfileRequest {
  return {
    guardianNickname: input.guardianNickname.trim(),
    guardianType: mapOptionalValue(
      input.guardianType,
      guardianTypeByLabel,
      "보호자 유형",
    ),
    communityRoleType: mapOptionalValue(
      input.guardianRole,
      communityRoleByLabel,
      "커뮤니티 역할",
    ),
  };
}

export function findRegionId(
  regions: Region[],
  sido: string,
  district: string,
) {
  const sameSidoRegions = regions.filter(
    (region) => region.regionLevel1 === sido,
  );

  if (district) {
    return sameSidoRegions.find(
      (region) =>
        region.regionLevel2 === district ||
        region.fullName === `${sido} ${district}`,
    )?.regionId;
  }

  return sameSidoRegions.find(
    (region) =>
      region.regionLevel2 === sido ||
      region.fullName === sido ||
      region.fullName === `${sido} ${sido}` ||
      sameSidoRegions.length === 1,
  )?.regionId;
}
