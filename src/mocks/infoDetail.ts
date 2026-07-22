import type { InfoDetail } from "@/types/info"

export const mockInfoDetail: InfoDetail = {
  id: 1,

  category: "HOSPITAL",
  subCategory: "발달클리닉",
  organizationType: "소아정신과",

  name: "드림발달클리닉",

  thumbnail:
    "",

  address: "서울특별시 강남구 테헤란로 123 드림빌딩 4층",

  district: "서울 강남구",

  phone: "02-555-2304",

  website: "https://dreamclinic.co.kr",

  views: 1204,
  scraps: 1204,
  reviews: 38,

  updatedAt: "2026.05.04",

  introduction:
    "드림발달클리닉은 강남구 소재 소아·청소년 정신건강 및 발달 전문 의원입니다. 소아청소년 진료 외에도 언어치료, 놀이치료, 감각통합치료, ADHD, 발달지연, 불안장애 등 다양한 분야의 전문 진료를 제공합니다. 전담 의료진과 협업 시스템으로 체계적인 상담 및 치료를 진행합니다.",

  specialties: [
    "발달검사",
    "자폐스펙트럼",
    "ADHD",
    "발달지연",
    "심리치료",
    "부모교육",
  ],

  hours: [
    {
      day: "월요일",
      open: "09:00",
      close: "18:00",
      closed: false,
    },
    {
      day: "화요일",
      open: "09:00",
      close: "18:00",
      closed: false,
    },
    {
      day: "수요일",
      open: "09:00",
      close: "20:00",
      description: "야간 진료",
      closed: false,
    },
    {
      day: "목요일",
      open: "09:00",
      close: "18:00",
      closed: false,
    },
    {
      day: "금요일",
      open: "09:00",
      close: "18:00",
      closed: false,
    },
    {
      day: "토요일",
      open: "09:00",
      close: "13:00",
      closed: false,
    },
    {
      day: "일요일",
      closed: true,
    },
  ],

  notice: "공휴일은 휴무입니다. 점심시간 PM 12:30 ~ 1:30",

  location: {
    lat: 37.4981,
    lng: 127.0276,
    distance: "3.1km",
  },

  reviewList: [],
};

export const mockReviews = [
  {
    id: 1,
    nickname: "행복한엄마",
    rating: 5,
    createdAt: "2026.04.21",
    content:
      "상담이 정말 꼼꼼했고 아이의 상태를 쉽게 설명해주셔서 좋았습니다. 예약은 조금 어렵지만 만족합니다.",
  },
  {
    id: 2,
    nickname: "아빠87",
    rating: 4,
    createdAt: "2026.03.15",
    content:
      "언어치료 선생님이 친절하고 시설도 깨끗했습니다.",
  },
];