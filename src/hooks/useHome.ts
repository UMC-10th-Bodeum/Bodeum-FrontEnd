import { useQuery } from "@tanstack/react-query";
import { getRecommendedNews } from "@/apis/home";

export const useRecommendedNews = () => {
  return useQuery({
    queryKey: ["recommendedNews"],
    queryFn: getRecommendedNews,
  });
};