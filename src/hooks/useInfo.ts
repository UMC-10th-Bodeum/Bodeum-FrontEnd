import { getInfoSearch } from "@/apis/infoApi";
import { useQuery } from "@tanstack/react-query";

export function useInfoSearch(keyword: string) {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: ["info-search", normalizedKeyword],
    queryFn: () => getInfoSearch(normalizedKeyword),
    enabled: normalizedKeyword.length >= 2,
  });
}