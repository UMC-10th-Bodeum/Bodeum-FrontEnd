import type { InfoDetail } from "@/types/info";

export const mockInfoDetail: InfoDetail = {
  infoId: 42,
  category: "HOSPITAL",
  name: "드림발달클리닉",
  introduction:
    "드림발달클리닉은 소아·청소년 정신건강 및 발달 전문 의원입니다. 소아정신과 전문의 2인이 상주하며 자폐스펙트럼, ADHD, 발달지연, 불안장애, 틱장애 등 다양한 발달 및 정서 문제를 다룹니다. 진단평가(발달검사, K-WISC, ADOS 등)부터 약물치료, 심리치료, 부모 코칭 프로그램까지 원스톱으로 제공합니다. 발달재활서비스 바우처 연계 기관과의 협력 네트워크도 운영하고 있습니다.",
  tags: [
    "소아정신과",
    "발달검사",
    "자폐스펙트럼",
    "ADHD",
    "발달지연",
    "심리치료",
    "부모코칭",
  ],
  operationHours: [
    { day: "월요일", time: "AM 09:00 ~ PM 06:00" },
    { day: "화요일", time: "AM 09:00 ~ PM 06:00" },
    { day: "수요일", time: "AM 09:00 ~ PM 08:00 (야간진료)" },
    { day: "목요일", time: "AM 09:00 ~ PM 06:00" },
    { day: "금요일", time: "AM 09:00 ~ PM 06:00" },
    { day: "토요일", time: "AM 09:00 ~ PM 01:00" },
    { day: "일요일", time: "휴무" },
  ],
  address: "서울특별시 강남구 테헤란로 123 드림빌딩 4층",
  phone: "02-555-2304",
  latitude: 37.5012,
  longitude: 127.0396,
  isScraped: true,
  avgRating: 4.6,
  reviewCount: 12,
};