import { useCallback } from "react";

import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { showToast } from "@/components/Toast";

export default function useCommunityMutationError(
  onLoginRequired: () => void,
  onUnauthorized?: () => void,
) {
  return useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (isUnauthorizedError(error)) {
        onUnauthorized?.();
        onLoginRequired();
        return;
      }

      showToast("red", getApiErrorMessage(error, fallbackMessage));
    },
    [onLoginRequired, onUnauthorized],
  );
}
