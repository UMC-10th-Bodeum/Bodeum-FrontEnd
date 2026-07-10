import InstitutionIcon from "@/assets/icons/institution.svg?react";
import HospitalIcon from "@/assets/icons/hospital.svg?react";
import WelfareIcon from "@/assets/icons/welfare.svg?react";
import EmploymentIcon from "@/assets/icons/employment.svg?react";
import EducationIcon from "@/assets/icons/education.svg?react";

export const infoCategoryMap = {
  INSTITUTION: {
    label: "기관",
    icon: InstitutionIcon,
    bgColor: "bg-sub-yellow-2",
    textColor: "text-sub-yellow",
  },
  HOSPITAL: {
    label: "병원",
    icon: HospitalIcon,
    bgColor: "bg-main-150",
    textColor: "text-red-500",
  },
  WELFARE: {
    label: "복지",
    icon: WelfareIcon,
    bgColor: "bg-sub-green-2",
    textColor: "text-sub-green",
  },
  EMPLOYMENT: {
    label: "취업",
    icon: EmploymentIcon,
    bgColor: "bg-sub-red-2",
    textColor: "text-sub-red",
  },
  EDUCATION: {
    label: "교육",
    icon: EducationIcon,
    bgColor: "bg-sub-purple-2",
    textColor: "text-sub-purple",
  },
} as const;

export type InfoCategoryType = keyof typeof infoCategoryMap;