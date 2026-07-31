import type { SearchSuggestionResponse } from "@/types/search";

export const searchMockData = {
  isSuccess: true,
  code: "COMMON200_1",
  message: "성공으로 요청을 처리했습니다.",
  result: {
    infoResults: [
      {
        infoId: 1,
        category: "HOSPITAL",
        name: "드림발달클리닉",
        address: "서울특별시 강남구 테헤란로 123",
        viewCount: 2184,
      },
      {
        infoId: 2,
        category: "HOSPITAL",
        name: "서울연세희망의원",
        address: "서울특별시 강남구 역삼동",
        viewCount: 1350,
      },
      {
        infoId: 5,
        category: "HOSPITAL",
        name: "다시온의원",
        address: "서울특별시 강남구 역삼동",
        viewCount: 1350,
      },
      {
        infoId: 3,
        category: "WELFARE",
        name: "서울시립장애인복지관",
        address: "서울특별시 강동구 천호동",
        viewCount: 930,
      },
      {
        infoId: 4,
        category: "EMPLOYMENT",
        name: "한국장애인고용공단",
        address: "경기도 성남시 분당구",
        viewCount: 2010,
      },
    ],
    totalCount: 8,
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