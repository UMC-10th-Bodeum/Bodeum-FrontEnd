import type { HomePostPreviewResponse, InfoItemCountsResponse, RecommendedNewsResponse } from "@/types/home";
import api from "./axios";

// 추천 소식 Top 5 조회
export const getRecommendedNews = async () => {
  const { data } = await api.get<RecommendedNewsResponse>(
    "/api/v1/news/recommended",
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

// 인기글/최신글 미리보기
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