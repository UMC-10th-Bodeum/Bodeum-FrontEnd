import { useQuery } from "@tanstack/react-query";
import { getKakaoMapUrl } from "@/apis/info";

export const useKakaoMapUrlQuery = (infoItemId: number) => {
  return useQuery({
    queryKey: ["kakaoMapUrl", infoItemId],
    queryFn: () => getKakaoMapUrl(infoItemId),
    enabled: !!infoItemId,
  });
};