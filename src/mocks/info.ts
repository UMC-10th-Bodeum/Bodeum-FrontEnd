import type { ParentCategory, InfoSubCategory } from "@/types/info";
import { infoSubCategoryMap } from "@/constants/infoCategory";
import type { ChipVariant } from "@/components/Chips";

export interface InfoItemData {
  id: number;
  type: ParentCategory;
  subCategory: InfoSubCategory["value"];
  name: string;
  address: string;
  services: string[];
  chipText: string;
  chipVariant: ChipVariant;
  viewCount: number;
  scrapCount: number;
  isScrapped: boolean;
}

let id = 1;

const subCategoryInfo: Record<
  InfoSubCategory["value"],
  { name: string; services: string[] }
> = {
  INSTITUTION_ETC: {
    name: "드림발달센터",
    services: ["언어치료", "인지치료", "놀이치료"],
  },
  THERAPY_REHAB: {
    name: "서울재활센터",
    services: ["재활치료", "작업치료", "물리치료"],
  },
  WELFARE_CENTER: {
    name: "행복복지관",
    services: ["상담", "돌봄", "프로그램"],
  },
  YOUTH_CENTER: {
    name: "꿈나무청소년센터",
    services: ["체험", "문화", "방과후"],
  },
  FAMILY_SUPPORT: {
    name: "가족지원센터",
    services: ["부모교육", "상담", "돌봄"],
  },

  HOSPITAL_ETC: {
    name: "서울소아병원",
    services: ["진료", "검사", "재활"],
  },
  GENERAL_HOSPITAL: {
    name: "삼성병원",
    services: ["소아과", "재활의학과", "신경과"],
  },
  PRIMARY_CARE: {
    name: "우리건강주치의",
    services: ["건강관리", "방문진료", "상담"],
  },
  EMERGENCY_CLINIC: {
    name: "응급의료센터",
    services: ["응급진료", "응급이송", "24시간"],
  },

  WELFARE_ETC: {
    name: "복지정보센터",
    services: ["상담", "지원", "교육"],
  },
  PRIVATE_WELFARE: {
    name: "민간복지재단",
    services: ["후원", "상담", "돌봄"],
  },
  NATIONAL_WELFARE: {
    name: "국가복지센터",
    services: ["바우처", "연금", "지원금"],
  },
  LOCAL_WELFARE: {
    name: "강남복지센터",
    services: ["지역서비스", "돌봄", "상담"],
  },

  EDUCATION_ETC: {
    name: "교육지원센터",
    services: ["교육", "상담", "체험"],
  },
  SPECIAL_SCHOOL: {
    name: "서울특수학교",
    services: ["초등", "중등", "고등"],
  },
  SPECIAL_EDU_SUPPORT: {
    name: "특수교육지원센터",
    services: ["순회교육", "진단", "상담"],
  },
  LIFELONG_EDU: {
    name: "평생교육원",
    services: ["평생교육", "문화", "자격"],
  },

  EMPLOYMENT_ETC: {
    name: "장애인고용센터",
    services: ["취업상담", "직업훈련", "채용"],
  },
  REALTIME_JOB: {
    name: "실시간채용센터",
    services: ["채용공고", "매칭", "상담"],
  },
  KEAD_JOB: {
    name: "KEAD 취업지원",
    services: ["취업", "훈련", "컨설팅"],
  },
  STANDARD_WORKPLACE: {
    name: "표준사업장",
    services: ["채용", "직무훈련", "현장실습"],
  },
};

const chipMap: Record<ParentCategory, string> = {
  INSTITUTION: "031-000-0000",
  HOSPITAL: "02-1234-5678",
  WELFARE: "복지서비스",
  EDUCATION: "교육기관",
  EMPLOYMENT: "상시모집",
};

export const infoMockData: InfoItemData[] = Object.entries(
  infoSubCategoryMap
).flatMap(([parent, subCategories]) =>
  subCategories.flatMap((sub) =>
    Array.from({ length: 20 }, (_, i) => ({
      id: id++,
      type: parent as ParentCategory,
      subCategory: sub.value,
      name: `${subCategoryInfo[sub.value].name} ${i + 1}`,
      address: `서울특별시 강남구 ${i + 1}길 ${i + 10}`,
      services: subCategoryInfo[sub.value].services,
      chipText: chipMap[parent as ParentCategory],
      chipVariant: "default",
      viewCount: 1000 + i * 23,
      scrapCount: 200 + i * 7,
      isScrapped: i % 3 === 0,
    }))
  )
);