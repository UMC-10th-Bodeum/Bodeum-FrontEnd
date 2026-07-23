import type { InfoDetailResponse } from "@/types/info";

export const infoDetailMockData: InfoDetailResponse = {
  isSuccess: true,
  code: "COMMON200_1",
  message: "성공으로 요청을 처리했습니다.",
  result: {
    infoItemId: 6,
    name: "건국대학교병원",
    mainCategory: "HOSPITAL",
    mainCategoryKo: "병원",
    subCategoryId: 4,
    subCategory: "EMERGENCY_CLINIC",
    subCategoryKo: "응급의료기관",
    address: "서울특별시 광진구 능동로 120-1",
    sido: "서울특별시",
    sigungu: "광진구",
    phone: "1588-1533",
    homepageUrl: "https://www.kuh.ac.kr",
    viewCount: 221,
    scrapCount: 33,
    reviewCount: 11,
    isScrapped: false,
    businessHours: [
      {
        dayOfWeek: "월요일",
        openTime: "08:30",
        closeTime: "17:30",
      },
      {
        dayOfWeek: "화요일",
        openTime: "08:30",
        closeTime: "17:30",
      },
      {
        dayOfWeek: "수요일",
        openTime: "08:30",
        closeTime: "17:30",
      },
      {
        dayOfWeek: "목요일",
        openTime: "08:30",
        closeTime: "17:30",
      },
      {
        dayOfWeek: "금요일",
        openTime: "08:30",
        closeTime: "17:30",
      },
      {
        dayOfWeek: "토요일",
        openTime: "08:30",
        closeTime: "12:30",
      },
      {
        dayOfWeek: "일요일",
        openTime: null,
        closeTime: null,
      },
    ],
  },
};

export const infoReviewMockData = {
  isSuccess: true,
  code: "INFO200_1",
  message: "성공으로 요청을 처리했습니다.",
  result: {
    avgRating: 4.6,
    totalCount: 12,
    reviews: [
      {
        reviewId: 7,
        rating: 4.6,
        nickname: "익명 부모님",
        createdAt: "2026.07.23",
        content:
          "발달검사를 여기서 받았는데 전문의 선생님이 정말 친절하게 설명해 주셨어요. ADOS 검사도 꼼꼼하게 진행해주셔서 신뢰가 갔습니다. 대기가 좀 있지만 그만한 가치가 있어요.",
        helpfulCount: 3,
        isHelpful: false,
      },
      {
        reviewId: 2,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 3,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 4,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 5,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 6,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 7,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 8,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 9,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 10,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 11,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
      {
        reviewId: 12,
        rating: 5.0,
        nickname: "익명 부모님",
        createdAt: "2026.07.20",
        content:
          "아이가 편안하게 검사를 받을 수 있도록 배려해주셔서 좋았습니다. 결과 설명도 자세해서 도움이 많이 됐어요.",
        helpfulCount: 5,
        isHelpful: true,
      },
    ],
  },
};