import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  exchangeSocialLoginCode,
  logoutCurrentUser,
  submitAgreements,
} from "@/apis/authApi";
import { queryKeys } from "@/queries/queryKeys";

export function useExchangeSocialLoginMutation() {
  return useMutation({
    mutationFn: exchangeSocialLoginCode,
    retry: false,
  });
}

export function useSubmitAgreementsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAgreements,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status,
      });
    },
    retry: false,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutCurrentUser,
    retry: false,
  });
}
