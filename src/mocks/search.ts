import type { SearchResponse, SearchSuggestionResponse } from "@/types/search";

export const searchMockData: SearchResponse = {
  isSuccess: true,
  code: "COMMON200_1",
  message: "성공으로 요청을 처리했습니다.",
  result: {
    items: [
      {
        infoItemId: 1,
        category: "HOSPITAL",
        categoryLabel: "병원",
        name: "드림발달클리닉",
        tags: ["언어치료", "ABA"],
      },
      {
        infoItemId: 2,
        category: "HOSPITAL",
        categoryLabel: "병원",
        name: "서울연세희망의원",
        tags: ["소아청소년과"],
      },
      {
        infoItemId: 5,
        category: "HOSPITAL",
        categoryLabel: "병원",
        name: "다시온의원",
        tags: ["재활의학과"],
      },
      {
        infoItemId: 3,
        category: "WELFARE",
        categoryLabel: "복지",
        name: "서울시립장애인복지관",
        tags: ["복지관", "상담"],
      },
      {
        infoItemId: 4,
        category: "EMPLOYMENT",
        categoryLabel: "취업",
        name: "한국장애인고용공단",
        tags: ["취업지원"],
      },
    ],
  },
};

export const searchSuggestionMockData: SearchSuggestionResponse = {
  isSuccess: true,
  code: "COMMON200_1",
  message: "성공으로 요청을 처리했습니다.",
  result: {
    suggestions: [
      {
        text: "봉사활동 참여자 모집",
        type: "NEWS_TITLE",
      },
      {
        text: "발달장애 부모 교육",
        type: "NEWS_TITLE",
      },
      {
        text: "발달장애 복지 정책",
        type: "NEWS_TITLE",
      },
      {
        text: "언어치료 병원 추천",
        type: "COMMUNITY_TITLE",
      },
      {
        text: "언어치료 프로그램 이용자 모집",
        type: "NEWS_TITLE",
      },
    ],
  },
};