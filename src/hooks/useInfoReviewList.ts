import { getInfoReviews } from "@/apis/infoApi";
import { useQuery } from "@tanstack/react-query";

export const useInfoReviewList = (
  infoItemId: number,
  page: number,
  size: number
) => {
  return useQuery({
    queryKey: ["info-reviews", infoItemId, page, size],
    queryFn: () => getInfoReviews(infoItemId, page, size),
    enabled: Number.isInteger(infoItemId) && infoItemId > 0,
  });
};