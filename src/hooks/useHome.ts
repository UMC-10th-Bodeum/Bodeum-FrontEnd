import { useQuery } from "@tanstack/react-query";
import { getInfoItemCounts, getRecommendedNews } from "@/apis/home";

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