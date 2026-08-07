import { useMutation } from "@tanstack/react-query";

import {
  exchangeSocialLoginCode,
  logoutCurrentUser,
  submitAgreements,
} from "@/apis/authApi";

export function useExchangeSocialLoginMutation() {
  return useMutation({
    mutationFn: exchangeSocialLoginCode,
    retry: false,
  });
}

export function useSubmitAgreementsMutation() {
  return useMutation({
    mutationFn: submitAgreements,
    retry: false,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutCurrentUser,
    retry: false,
  });
}
