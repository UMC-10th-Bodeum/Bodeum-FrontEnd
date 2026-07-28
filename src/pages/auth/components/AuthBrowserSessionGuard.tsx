import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  AUTH_STATE_CHANGED_EVENT,
  hasStoredAuthSession,
  logoutCurrentUser,
} from "@/apis/authApi";

import {
  clearAgreementBrowserSession,
  markAgreementInterruptedLogoutNotice,
  shouldCheckAgreementBrowserSessionInterruption,
  wasAgreementBrowserSessionInterrupted,
} from "../agreementBrowserSession";
import {
  clearAuthBrowserSession,
  isAuthBrowserSessionPending,
  shouldCheckAuthBrowserSessionInterruption,
  startAuthBrowserSession,
  wasAuthBrowserSessionInterrupted,
} from "../authBrowserSession";
import { clearAuthProgress } from "../authProgressStorage";
import {
  clearOnboardingBrowserSession,
  completeInterruptedOnboarding,
  shouldCheckOnboardingBrowserSessionInterruption,
  wasOnboardingBrowserSessionInterrupted,
} from "../onboardingBrowserSession";
import AuthLoadingState from "./AuthLoadingState";

type InterruptedSession = {
  agreement: boolean;
  onboarding: boolean;
};

let interruptionLogoutPromise: Promise<boolean> | null = null;

function shouldCheckInterruptedSession() {
  if (!hasStoredAuthSession()) {
    return false;
  }

  if (isAuthBrowserSessionPending()) {
    return shouldCheckAuthBrowserSessionInterruption();
  }

  // Compatibility for flows that started before the global session marker existed.
  return (
    shouldCheckAgreementBrowserSessionInterruption() ||
    shouldCheckOnboardingBrowserSessionInterruption()
  );
}

async function getInterruptedSession(): Promise<InterruptedSession | null> {
  if (isAuthBrowserSessionPending()) {
    if (
      !shouldCheckAuthBrowserSessionInterruption() ||
      !(await wasAuthBrowserSessionInterrupted())
    ) {
      return null;
    }

    return {
      agreement: shouldCheckAgreementBrowserSessionInterruption(),
      onboarding: shouldCheckOnboardingBrowserSessionInterruption(),
    };
  }

  const [agreement, onboarding] = await Promise.all([
    shouldCheckAgreementBrowserSessionInterruption()
      ? wasAgreementBrowserSessionInterrupted()
      : false,
    shouldCheckOnboardingBrowserSessionInterruption()
      ? wasOnboardingBrowserSessionInterrupted()
      : false,
  ]);

  return agreement || onboarding ? { agreement, onboarding } : null;
}

function enforceInterruptedAuthLogout() {
  if (interruptionLogoutPromise) {
    return interruptionLogoutPromise;
  }

  interruptionLogoutPromise = (async () => {
    const interruptedSession = await getInterruptedSession();

    if (!interruptedSession) {
      return false;
    }

    if (interruptedSession.onboarding) {
      try {
        await completeInterruptedOnboarding();
      } catch {
        // Closing the browser must still end the local login session.
      }
    }

    if (interruptedSession.agreement) {
      markAgreementInterruptedLogoutNotice();
    }

    clearAuthBrowserSession();
    clearAgreementBrowserSession();
    clearOnboardingBrowserSession();
    clearAuthProgress();

    void logoutCurrentUser({ clearImmediately: true }).catch(() => {
      // Local logout is already complete. Server session revocation is best effort.
    });

    return true;
  })().finally(() => {
    interruptionLogoutPromise = null;
  });

  return interruptionLogoutPromise;
}

export default function AuthBrowserSessionGuard() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(shouldCheckInterruptedSession);

  useEffect(() => {
    let cancelled = false;

    const syncAuthBrowserSession = () => {
      if (hasStoredAuthSession()) {
        startAuthBrowserSession();
        return;
      }

      clearAuthBrowserSession();
    };

    const initializeAuthBrowserSession = async () => {
      if (!hasStoredAuthSession()) {
        clearAuthBrowserSession();
        setIsChecking(false);
        return;
      }

      if (shouldCheckInterruptedSession()) {
        const wasLoggedOut = await enforceInterruptedAuthLogout();

        if (cancelled) {
          return;
        }

        if (wasLoggedOut) {
          navigate("/", { replace: true });
          setIsChecking(false);
          return;
        }
      }

      startAuthBrowserSession();
      setIsChecking(false);
    };

    window.addEventListener(
      AUTH_STATE_CHANGED_EVENT,
      syncAuthBrowserSession,
    );
    void initializeAuthBrowserSession();

    return () => {
      cancelled = true;
      window.removeEventListener(
        AUTH_STATE_CHANGED_EVENT,
        syncAuthBrowserSession,
      );
    };
  }, [navigate]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-main-150 px-[20px] py-[40px]">
        <AuthLoadingState message="로그인 상태를 확인하고 있습니다." />
      </main>
    );
  }

  return <Outlet />;
}
