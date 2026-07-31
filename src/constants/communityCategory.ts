export const communityCategoryMap = {
  FREE: "자유소통",
  GROWTH_RECORD: "치료 · 성장 기록",
  LOCAL_NEWS: "우리 동네 소식",
  CENTER_REVIEW: "기관 · 센터 후기",
  QUESTION: "정보 · 질문 광장",
} as const;

export type CommunityCategory = keyof typeof communityCategoryMap;

export const communityCategoryEntries = Object.entries(
  communityCategoryMap,
) as Array<[CommunityCategory, string]>;

export function isCommunityCategory(
  value: string | null,
): value is CommunityCategory {
  return (
    value !== null &&
    Object.prototype.hasOwnProperty.call(communityCategoryMap, value)
  );
}
