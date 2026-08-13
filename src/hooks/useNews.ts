import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNews,
  getNewsDetail,
  getNewsSearchSuggestions,
  searchNews,
  toggleNewsScrap,
} from "@/apis/newsApi";
import type {
  NewsDetail,
  NewsListParams,
  NewsSearchParams,
} from "@/types/news";

export function useNews(params: NewsListParams, enabled = true) {
  return useQuery({
    queryKey: ["news", "list", params],
    queryFn: () => getNews(params),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

export function useNewsSearch(params: NewsSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["news", "search", params],
    queryFn: () => searchNews(params),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

export function useNewsSearchSuggestions(keyword: string, size = 10) {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: ["news", "search-suggestions", normalizedKeyword, size],
    queryFn: () => getNewsSearchSuggestions(normalizedKeyword, size),
    enabled: normalizedKeyword.length >= 2,
    staleTime: 30_000,
  });
}

export function useNewsDetail(newsId: number | undefined) {
  return useQuery({
    queryKey: ["news", "detail", newsId],
    queryFn: () => getNewsDetail(newsId as number),
    enabled: newsId !== undefined,
  });
}

export function useToggleNewsScrap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNewsScrap,
    onSuccess: (result) => {
      queryClient.setQueryData<NewsDetail>(
        ["news", "detail", result.newsId],
        (previous) =>
          previous
            ? {
                ...previous,
                scrapped: result.scrapped,
                scrapCount: result.scrapCount,
              }
            : previous,
      );

      void queryClient.invalidateQueries({
        queryKey: ["news"],
        predicate: (query) => query.queryKey[1] !== "detail",
      });
    },
  });
}
