import type { SearchSuggestionResponse } from "@/types/search";

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