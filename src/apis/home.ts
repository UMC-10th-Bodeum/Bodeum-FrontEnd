import type { HomeBannerResponse, HomeNewsPreviewResponse, HomePostPreviewResponse, InfoItemCountsResponse, RecommendedCommunityPostResponse, RecommendedNewsResponse } from "@/types/home";
import api from "./axios";

// 공지사항 배너 조회
export const getHomeBanner = async () => {
  const { data } = await api.get<HomeBannerResponse>(
    "/api/v1/home/banner",
  );

  return data.result;
};

// 카테고리별 정보 건수 조회
export const getInfoItemCounts = async () => {
  const { data } = await api.get<InfoItemCountsResponse>(
    "/api/v1/info-items/counts",
  );

  return data.result;
};

// 추천 소식 Top 5 조회
export const getRecommendedNews = async () => {
  const { data } = await api.get<RecommendedNewsResponse>(
    "/api/v1/news/recommended",
  );

  return data.result;
};

// 활동소식/지역소식 미리보기 조회
export const getHomeNewsPreview = async (
  newsType: "LOCAL" | "ACTIVITY",
  limit = 3,
) => {
  const { data } = await api.get<HomeNewsPreviewResponse>(
    "/api/v1/home/news/preview",
    {
      params: {
        newsType,
        limit,
      },
    },
  );

  return data.result;
};

// 커뮤니티 추천게시글 조회
export const getRecommendedCommunityPosts = async (limit = 5) => {
  const { data } =
    await api.get<RecommendedCommunityPostResponse>(
      "/api/v1/community/posts/recommended",
      {
        params: {
          limit,
        },
      },
    );
  return data.result;
};

// 인기글/최신글 미리보기 조회
export const getHomePostPreview = async (
  sort: "popular" | "latest",
  limit = 3,
) => {
  const { data } = await api.get<HomePostPreviewResponse>(
    "/api/v1/home/posts/preview",
    {
      params: {
        sort,
        limit,
      },
    },
  );

  return data.result;
};