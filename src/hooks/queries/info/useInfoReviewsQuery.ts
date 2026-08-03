import { getInfoReviews } from "@/apis/info";
import { useQuery } from "@tanstack/react-query";

export const useInfoReviewListQuery = (
  infoItemId: number,
  page: number,
  size: number
) => {
  return useQuery({
    queryKey: ["info-reviews", infoItemId, page, size],
    queryFn: () => getInfoReviews(infoItemId, page, size),
  });
};