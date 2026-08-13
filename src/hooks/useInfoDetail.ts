import { useQuery } from "@tanstack/react-query";
import { getInfoDetail } from "@/apis/infoApi";

export const useInfoDetail = (infoItemId: number) => {
  return useQuery({
    queryKey: ["info-detail", infoItemId],
    queryFn: () => getInfoDetail(infoItemId),
    enabled: Number.isInteger(infoItemId) && infoItemId > 0,
  });
};