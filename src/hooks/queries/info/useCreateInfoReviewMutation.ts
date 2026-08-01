import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInfoReview } from "@/apis/info";

export const useCreateInfoReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      infoItemId,
      body,
    }: {
      infoItemId: number;
      body: {
        rating: number;
        content: string;
        imageUrls: string[];
      };
    }) => createInfoReview(infoItemId, body),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["info-detail", variables.infoItemId],
      });

      queryClient.invalidateQueries({
        queryKey: ["info-reviews", variables.infoItemId],
      });
    },
  });
};