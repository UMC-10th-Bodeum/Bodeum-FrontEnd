import type { RecommendedNewsResponse } from "@/types/home";
import apiClient from "./axios";

export const getRecommendedNews = async () => {
  const { data } = await apiClient.get<RecommendedNewsResponse>(
    "/api/v1/news/recommended",
  );

  return data.result;
};