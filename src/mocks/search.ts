import type { SearchResponse } from "@/types/search";

export const searchMockData: SearchResponse = {
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
    newsResults: [
      {
        newsId: 1,
        title: "언어치료 프로그램 이용자 모집",
        region: "부산 수영구",
        viewCount: 1204,
      },
      {
        newsId: 2,
        title: "발달장애 가족지원 사업 신청 안내",
        region: "서울 강남구",
        viewCount: 875,
      },
    ],
    communityResults: [
      {
        postId: 1,
        categoryName: "정보·질문 광장",
        title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요",
        viewCount: 1204,
      },
      {
        postId: 2,
        categoryName: "자유게시판",
        title: "언어치료 병원 추천 부탁드립니다.",
        viewCount: 562,
      },
    ],
    totalCount: 8,
  },
};