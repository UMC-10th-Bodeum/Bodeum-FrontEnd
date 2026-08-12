import { useCallback, useRef } from "react";
import { hasStoredAuthSession } from "@/apis/authApi";
import { useUserBrief } from "@/hooks/useUser";

export function useLoginCheck() {
  const { data: userBrief, isPending, isError, refetch } = useUserBrief();
  const checkInFlight = useRef(false);
  const isLoggedIn =
    !isError && hasStoredAuthSession() && userBrief?.isLoggedIn === true;

  const runAfterLoginCheck = useCallback(
    async (onAuthenticated: () => void, onLoginRequired: () => void) => {
      if (checkInFlight.current) {
        return;
      }

      if (!hasStoredAuthSession()) {
        onLoginRequired();
        return;
      }

      checkInFlight.current = true;

      try {
        const result = await refetch();
        const isAuthenticated =
          !result.isError && hasStoredAuthSession() && result.data?.isLoggedIn === true;

        if (!isAuthenticated) {
          onLoginRequired();
          return;
        }

        onAuthenticated();
      } finally {
        checkInFlight.current = false;
      }
    },
    [refetch],
  );

  return { isLoggedIn, isPending, isError, runAfterLoginCheck };
}
