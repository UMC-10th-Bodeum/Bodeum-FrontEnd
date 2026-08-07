export const communityCategoryMap = {
  FREE: "자유소통",
  GROWTH_RECORD: "치료 · 성장 기록",
  LOCAL_NEWS: "우리 동네 소식",
  CENTER_REVIEW: "기관 · 센터 후기",
  QUESTION: "정보 · 질문 광장",
} as const;

export type CommunityCategory = keyof typeof communityCategoryMap;

export type CommunityCategoryCode =
  | "FREE_COMMUNICATION"
  | "TREATMENT_GROWTH_RECORD"
  | "NEIGHBORHOOD_NEWS"
  | "INSTITUTION_CENTER_REVIEW"
  | "INFORMATION_QUESTION";

export const communityCategoryCodeMap: Record<CommunityCategory, CommunityCategoryCode> = {
  FREE: "FREE_COMMUNICATION",
  GROWTH_RECORD: "TREATMENT_GROWTH_RECORD",
  LOCAL_NEWS: "NEIGHBORHOOD_NEWS",
  CENTER_REVIEW: "INSTITUTION_CENTER_REVIEW",
  QUESTION: "INFORMATION_QUESTION",
};

const communityCategoryCodeSet = new Set<string>(Object.values(communityCategoryCodeMap));

export function isCommunityCategoryCode(value: string | null): value is CommunityCategoryCode {
  return value !== null && communityCategoryCodeSet.has(value);
}

export function getCommunityCategoryByCode(code: CommunityCategoryCode): CommunityCategory {
  const entry = Object.entries(communityCategoryCodeMap).find(
    ([, categoryCode]) => categoryCode === code,
  );

  return entry?.[0] as CommunityCategory;
}

export const communityCategoryEntries = Object.entries(communityCategoryMap) as Array<
  [CommunityCategory, string]
>;

export function isCommunityCategory(value: string | null): value is CommunityCategory {
  return value !== null && Object.prototype.hasOwnProperty.call(communityCategoryMap, value);
}
