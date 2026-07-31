import type { ParentCategory, InfoSubCategory } from "@/types/info";
import InstitutionIcon from "@/assets/icons/institution.svg?react";
import HospitalIcon from "@/assets/icons/hospital.svg?react";
import WelfareIcon from "@/assets/icons/welfare.svg?react";
import EmploymentIcon from "@/assets/icons/employment.svg?react";
import EducationIcon from "@/assets/icons/education.svg?react";
import SearchInstitutionIcon from "@/assets/icons/searchInstitution.svg?react";
import SearchHospitalIcon from "@/assets/icons/searchHospital.svg?react";
import SearchWelfareIcon from "@/assets/icons/searchWelfare.svg?react";
import SearchEmploymentIcon from "@/assets/icons/searchEmployment.svg?react";
import SearchEducationIcon from "@/assets/icons/searchEducation.svg?react";

export const infoCategoryMap = {
  INSTITUTION: {
    label: "기관",
    icon: InstitutionIcon,
    bgColor: "bg-sub-yellow-2",
    textColor: "text-sub-yellow",
    buttonClass:
      "bg-sub-yellow-2 text-sub-yellow active:bg-sub-yellow active:text-sub-yellow-2",
  },
  HOSPITAL: {
    label: "병원",
    icon: HospitalIcon,
    bgColor: "bg-main-150",
    textColor: "text-main-500",
    buttonClass:
      "bg-main-150 text-main-500 active:bg-main-500 active:text-main-150",
  },
  WELFARE: {
    label: "복지",
    icon: WelfareIcon,
    bgColor: "bg-sub-green-2",
    textColor: "text-sub-green",
    buttonClass:
      "bg-sub-green-2 text-sub-green active:bg-sub-green active:text-sub-green-2",
  },
  EDUCATION: {
    label: "교육",
    icon: EducationIcon,
    bgColor: "bg-sub-purple-2",
    textColor: "text-sub-purple",
    buttonClass:
      "bg-sub-purple-2 text-sub-purple active:bg-sub-purple active:text-sub-purple-2",

  },
  EMPLOYMENT: {
    label: "취업",
    icon: EmploymentIcon,
    bgColor: "bg-sub-red-2",
    textColor: "text-sub-red",
    buttonClass:
      "bg-sub-red-2 text-sub-red active:bg-sub-red active:text-sub-red-2",
  },
} as const;

export const infoSubCategoryMap: Record<ParentCategory, readonly InfoSubCategory[]> = {
  INSTITUTION: [
    { id: 5, value: "INSTITUTION_ETC", label: "기관 추천" },
    { id: 6, value: "THERAPY_REHAB", label: "치료·재활기관" },
    { id: 7, value: "WELFARE_CENTER", label: "장애인 복지관" },
    { id: 8, value: "YOUTH_CENTER", label: "청소년 수련관" },
    { id: 9, value: "FAMILY_SUPPORT", label: "장애인가족지원센터" },
  ],
  HOSPITAL: [
    { id: 1, value: "HOSPITAL_ETC", label: "병원 추천" },
    { id: 2, value: "GENERAL_HOSPITAL", label: "병원" },
    { id: 3, value: "PRIMARY_CARE", label: "건강주치의" },
    { id: 4, value: "EMERGENCY_CLINIC", label: "응급의료기관" },
  ],
  WELFARE: [
    { id: 10, value: "WELFARE_ETC", label: "복지 추천" },
    { id: 11, value: "PRIVATE_WELFARE", label: "민간 복지 서비스" },
    { id: 12, value: "NATIONAL_WELFARE", label: "국가 복지 서비스" },
    { id: 13, value: "LOCAL_WELFARE", label: "지역 복지 서비스" },
  ],
  EDUCATION: [
    { id: 14, value: "EDUCATION_ETC", label: "취업 추천" },
    { id: 15, value: "SPECIAL_SCHOOL", label: "특수 학교 현황" },
    { id: 16, value: "SPECIAL_EDU_SUPPORT", label: "특수 교육 지원 센터" },
    { id: 17, value: "LIFELONG_EDU", label: "장애인 평생 교육 기관" },
  ],
  EMPLOYMENT: [
    { id: 18, value: "EMPLOYMENT_ETC", label: "고용 추천" },
    { id: 19, value: "REALTIME_JOB", label: "실시간 구인 정보" },
    { id: 20, value: "KEAD_JOB", label: "KEAD 취업 정보" },
    { id: 21, value: "STANDARD_WORKPLACE", label: "장애인 표준 사업장" },
  ],
};

export const searchCategoryIconMap = {
  INSTITUTION: SearchInstitutionIcon,
  HOSPITAL: SearchHospitalIcon,
  WELFARE: SearchWelfareIcon,
  EMPLOYMENT: SearchEmploymentIcon,
  EDUCATION: SearchEducationIcon,
} as const;

export type InfoCategory = keyof typeof infoCategoryMap;