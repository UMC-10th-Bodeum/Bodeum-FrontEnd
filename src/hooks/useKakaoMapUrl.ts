import { useQuery } from "@tanstack/react-query";
import { getKakaoMapUrl } from "@/apis/infoApi";

export const useKakaoMapUrl = (infoItemId: number) => {
  return useQuery({
    queryKey: ["kakaoMapUrl", infoItemId],
    queryFn: () => getKakaoMapUrl(infoItemId),
    enabled: !!infoItemId,
  });
};