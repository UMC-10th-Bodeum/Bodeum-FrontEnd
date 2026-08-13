import api from "./axios";
import type {
  NewsDetailResponse,
  NewsListParams,
  NewsListResponse,
  NewsScrapResponse,
  NewsSearchParams,
} from "@/types/news";
import type { SearchSuggestionResponse } from "@/types/search";

export const getNews = async (params: NewsListParams = {}) => {
  const { data } = await api.get<NewsListResponse>("/api/v1/news", {
    params,
  });

  return data.result;
};

export const searchNews = async (params: NewsSearchParams) => {
  const { data } = await api.get<NewsListResponse>("/api/v1/news/search", {
    params,
  });

  return data.result;
};

export const getNewsSearchSuggestions = async (keyword: string, size = 10) => {
  const { data } = await api.get<SearchSuggestionResponse>(
    "/api/v1/news/search/suggestions",
    { params: { keyword, size } },
  );

  return data.result.suggestions;
};

export const getNewsDetail = async (newsId: number) => {
  const { data } = await api.get<NewsDetailResponse>(`/api/v1/news/${newsId}`);

  return data.result;
};

export const toggleNewsScrap = async (newsId: number) => {
  const { data } = await api.post<NewsScrapResponse>(
    `/api/v1/news/${newsId}/scrap`,
  );

  return data.result;
};
