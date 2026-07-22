import type { InfoItemCountsResponse, RecommendedNewsResponse } from "@/types/home";
import api from "./axios";

export const getRecommendedNews = async () => {
  const { data } = await api.get<RecommendedNewsResponse>(
    "/api/v1/news/recommended",
  );

  return data.result;
};

export const getInfoItemCounts = async () => {
  const { data } = await api.get<InfoItemCountsResponse>(
    "/api/v1/info-items/counts",
  );

  return data.result;
};