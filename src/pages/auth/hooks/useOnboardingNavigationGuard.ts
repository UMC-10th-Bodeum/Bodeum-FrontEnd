import { useCallback, useLayoutEffect, useRef } from "react";

import { getApiErrorMessage } from "@/apis/apiError";
import { showToast } from "@/components/Toast";
import { wait } from "@/utils/async";
import type { AuthFlow } from "../authFlow";

const BROWSER_BACK_SETTLE_MS = 400;
const AUTH_HISTORY_GUARD_KEY = "bodeumAuthGuard";
const AUTH_HISTORY_GUARD_DEPTH = 24;

type AuthHistoryGuard = {
  id: string;
  index: number;
};

interface UseOnboardingNavigationGuardOptions {
  flow: AuthFlow;
  shouldHandleAgreementBack: boolean;
  shouldProtectOnboardingHistory: boolean;
  shouldSeedAuthHistory: boolean;
  requestInFlight: { current: boolean };
  setIsSubmitting: (isSubmitting: boolean) => void;
  exitIncompleteAgreement: () => void;
  skipOnboarding: () => Promise<{ nextStep: string }>;
  completeOnboarding: () => Promise<void>;
  onSkipCompleted: () => void;
}

function getAuthHistoryGuard(): AuthHistoryGuard | null {
  const state = window.history.state as
    | Record<string, unknown>
    | null
    | undefined;
  const guard = state?.[AUTH_HISTORY_GUARD_KEY];

  if (
    !guard ||
    typeof guard !== "object" ||
    !("id" in guard) ||
    !("index" in guard) ||
    typeof guard.id !== "string" ||
    typeof guard.index !== "number"
  ) {
    return null;
  }

  return { id: guard.id, index: guard.index };
}

function createAuthHistoryState(guard: AuthHistoryGuard) {
  const currentState =
    window.history.state && typeof window.history.state === "object"
      ? window.history.state
      : {};

  return {
    ...currentState,
    [AUTH_HISTORY_GUARD_KEY]: guard,
  };
}

export function useOnboardingNavigationGuard({
  flow,
  shouldHandleAgreementBack,
  shouldProtectOnboardingHistory,
  shouldSeedAuthHistory,
  requestInFlight,
  setIsSubmitting,
  exitIncompleteAgreement,
  skipOnboarding,
  completeOnboarding,
  onSkipCompleted,
}: UseOnboardingNavigationGuardOptions) {
  const browserBackInFlight = useRef(false);
  const authHistoryGuardId = useRef<string | null>(null);
  const isCollapsingAuthHistory = useRef(false);
  const lastBrowserBackAt = useRef(0);

  const resetBrowserBackGuard = useCallback(() => {
    browserBackInFlight.current = false;
  }, []);

  const collapseAuthHistory = useCallback(async () => {
    const guard = getAuthHistoryGuard();

    if (
      !guard ||
      !authHistoryGuardId.current ||
      guard.id !== authHistoryGuardId.current
    ) {
      return;
    }

    isCollapsingAuthHistory.current = true;

    if (guard.index <= 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      let settled = false;

      const finish = () => {
        if (settled) return;

        settled = true;
        window.removeEventListener("popstate", finish);
        window.clearTimeout(timeoutId);
        resolve();
      };

      const timeoutId = window.setTimeout(finish, BROWSER_BACK_SETTLE_MS);
      window.addEventListener("popstate", finish);
      window.history.go(-guard.index);
    });
  }, []);

  const waitForBrowserBackToSettle = useCallback(async () => {
    while (true) {
      const remaining =
        lastBrowserBackAt.current + BROWSER_BACK_SETTLE_MS - Date.now();

      if (remaining <= 0) return;
      await wait(remaining);
    }
  }, []);

  useLayoutEffect(() => {
    if (!shouldHandleAgreementBack) return;

    window.addEventListener("popstate", exitIncompleteAgreement);
    return () => {
      window.removeEventListener("popstate", exitIncompleteAgreement);
    };
  }, [exitIncompleteAgreement, shouldHandleAgreementBack]);

  useLayoutEffect(() => {
    if (!shouldProtectOnboardingHistory) return;

    const handleBrowserBack = () => {
      if (isCollapsingAuthHistory.current) return;

      lastBrowserBackAt.current = Date.now();
      const guardId = authHistoryGuardId.current;
      const currentGuard = getAuthHistoryGuard();

      if (guardId) {
        const nextIndex =
          currentGuard?.id === guardId ? currentGuard.index + 1 : 1;

        window.history.pushState(
          createAuthHistoryState({ id: guardId, index: nextIndex }),
          "",
          "/auth?flow=onboarding",
        );
      }

      if (browserBackInFlight.current) return;

      if (requestInFlight.current) {
        showToast("red", "진행 중인 처리가 끝난 후 다시 시도해주세요.");
        return;
      }

      browserBackInFlight.current = true;
      requestInFlight.current = true;
      setIsSubmitting(true);

      void skipOnboarding()
        .then(async (result) => {
          if (result.nextStep !== "HOME") {
            throw new Error("온보딩 건너뛰기 상태를 확인하지 못했습니다.");
          }

          await waitForBrowserBackToSettle();
          onSkipCompleted();
          await completeOnboarding();
        })
        .catch(async (error: unknown) => {
          await waitForBrowserBackToSettle();
          showToast(
            "red",
            getApiErrorMessage(
              error,
              "온보딩을 건너뛰지 못했습니다. 잠시 후 다시 시도해주세요.",
            ),
          );
        })
        .finally(() => {
          browserBackInFlight.current = false;
          requestInFlight.current = false;
          setIsSubmitting(false);
        });
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => {
      window.removeEventListener("popstate", handleBrowserBack);
    };
  }, [
    completeOnboarding,
    onSkipCompleted,
    requestInFlight,
    setIsSubmitting,
    shouldProtectOnboardingHistory,
    skipOnboarding,
    waitForBrowserBackToSettle,
  ]);

  useLayoutEffect(() => {
    if (!shouldSeedAuthHistory) return;

    const protectedUrl =
      flow === "agreement"
        ? "/auth?flow=agreement"
        : "/auth?flow=onboarding";
    const targetGuardDepth =
      flow === "agreement" ? 1 : AUTH_HISTORY_GUARD_DEPTH;
    const existingGuard = getAuthHistoryGuard();

    if (authHistoryGuardId.current) {
      if (
        existingGuard?.id !== authHistoryGuardId.current ||
        existingGuard.index >= targetGuardDepth
      ) {
        return;
      }

      for (
        let index = existingGuard.index + 1;
        index <= targetGuardDepth;
        index += 1
      ) {
        window.history.pushState(
          createAuthHistoryState({ id: existingGuard.id, index }),
          "",
          protectedUrl,
        );
      }
      return;
    }

    const guardId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    authHistoryGuardId.current = guardId;
    window.history.replaceState(
      createAuthHistoryState({ id: guardId, index: 0 }),
      "",
      protectedUrl,
    );

    for (let index = 1; index <= targetGuardDepth; index += 1) {
      window.history.pushState(
        createAuthHistoryState({ id: guardId, index }),
        "",
        protectedUrl,
      );
    }
  }, [flow, shouldSeedAuthHistory]);

  return {
    collapseAuthHistory,
    isCollapsingAuthHistory,
    resetBrowserBackGuard,
  };
}
