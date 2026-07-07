import type { DiagnosisType } from "@/types/diagnosis";

export const diagnosisMap: Record<
  DiagnosisType,
  {
    label: string;
    className: string;
  }
> = {
  AUTISM: {
    label: "자폐스펙트럼",
    className: "bg-[#EEF2FF] text-[#1C378C]",
  },
  INTELLECTUAL_DISABILITY: {
    label: "지적장애",
    className: "bg-[#FDF2F8] text-[#B01554]",
  },
  CEREBRAL_PALSY: {
    label: "뇌병변장애",
    className: "bg-[#FDF6D6] text-[#AD531B]",
  },
  ADHD: {
    label: "ADHD",
    className: "bg-[#E6F8DA] text-[#2D611A]",
  },
  DEVELOPMENTAL_DELAY: {
    label: "발달지연",
    className: "bg-sub-purple-2 text-sub-purple",
  },
  LANGUAGE_DISORDER: {
    label: "언어장애",
    className: "bg-[#FDEFDB] text-[#7F3E15]",
  },
  ETC: {
    label: "기타",
    className: "bg-background-200 text-background-600",
  },
};