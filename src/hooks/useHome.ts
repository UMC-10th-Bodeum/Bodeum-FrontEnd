import { useQuery } from "@tanstack/react-query";
import { getHomeNewsPreview, getHomePostPreview, getInfoItemCounts, getRecommendedNews } from "@/apis/home";

export const useRecommendedNews = () => {
  return useQuery({
    queryKey: ["recommendedNews"],
    queryFn: getRecommendedNews,
  });
};

export const useInfoItemCounts = () => {
  return useQuery({
    queryKey: ["infoItemCounts"],
    queryFn: getInfoItemCounts,
  });
};

export const useHomePostPreview = (
  sort: "popular" | "latest",
  limit = 3,
) => {
  return useQuery({
    queryKey: ["homePostPreview", sort, limit],
    queryFn: () => getHomePostPreview(sort, limit),
  });
};

export const useHomeNewsPreview = (
  newsType: "LOCAL" | "ACTIVITY",
  limit = 3,
) => {
  return useQuery({
    queryKey: ["homeNewsPreview", newsType, limit],
    queryFn: () => getHomeNewsPreview(newsType, limit),
  });
};