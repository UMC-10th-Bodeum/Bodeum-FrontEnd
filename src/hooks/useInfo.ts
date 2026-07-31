import { getInfoSearch } from "@/apis/info";
import { useQuery } from "@tanstack/react-query";

export function useInfoSearch(keyword: string) {
  return useQuery({
    queryKey: ["info-search", keyword],
    queryFn: () => getInfoSearch(keyword),
    enabled: keyword.trim().length >= 2,
  });
}