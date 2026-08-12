import type { InterestCategory } from "@/types/user";

export const interestOptions = [
  "맞춤 복지·지원금",
  "안심 병원·건강",
  "육아 상담·소통",
  "성장·교육",
] as const;

export type InterestOption = (typeof interestOptions)[number];

export const interestCategoryByLabel: Record<InterestOption, InterestCategory> = {
  "맞춤 복지·지원금": "WELFARE_SUBSIDY",
  "안심 병원·건강": "HOSPITAL_HEALTH",
  "육아 상담·소통": "PARENTING_COMMUNICATION",
  "성장·교육": "GROWTH_EDUCATION",
};

export const interestLabelByCategory: Record<InterestCategory, InterestOption> = {
  WELFARE_SUBSIDY: "맞춤 복지·지원금",
  HOSPITAL_HEALTH: "안심 병원·건강",
  PARENTING_COMMUNICATION: "육아 상담·소통",
  GROWTH_EDUCATION: "성장·교육",
};
