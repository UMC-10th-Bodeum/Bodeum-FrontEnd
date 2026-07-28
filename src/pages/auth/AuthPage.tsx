import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  useNavigate,
  useNavigationType,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

import { getApiErrorMessage } from "@/apis/apiError";
import {
  hasStoredAuthSession,
  startSocialLogin,
  submitAgreements,
  type AgreementFormValues,
  type SocialProvider,
} from "@/apis/authApi";
import {
  createEmptyOnboardingDraft,
  getOnboardingResume,
  getOnboardingStatus,
  quitOnboarding,
  registerChildProfile,
  registerGuardianProfile,
  registerInterestRegion,
  skipOnboarding,
} from "@/apis/onboardingApi";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";

import AuthAgreementCard from "./components/AuthAgreementCard";
import AuthLoadErrorState from "./components/AuthLoadErrorState";
import AuthLoadingState from "./components/AuthLoadingState";
import AuthLoginCard from "./components/AuthLoginCard";
import OnboardingStepCard from "./components/OnboardingStepCard";
import type {
  OnboardingFormState,
  OnboardingStep,
} from "./components/OnboardingStepCard";
import {
  getStoredAuthNextStep,
  storeAuthNextStep,
} from "./authProgressStorage";
import {
  resolveAuthPageFlow,
  resolveProfileOnboardingDestination,
  resolveRequestedAuthFlow,
  type AuthFlow,
} from "./authFlow";
import {
  clearAgreementBrowserSession,
  consumeAgreementInterruptedLogoutNotice,
  startAgreementBrowserSession,
  wasAgreementBrowserSessionInterrupted,
} from "./agreementBrowserSession";
import {
  clearOnboardingBrowserSession,
  completeInterruptedOnboarding,
  startOnboardingBrowserSession,
  wasOnboardingBrowserSessionInterrupted,
} from "./onboardingBrowserSession";

type OnboardingModal = "cancel" | "skip" | null;

const ONBOARDING_RESUME_RETRY_DELAYS = [500, 1_500] as const;
const BROWSER_BACK_SETTLE_MS = 400;
const AUTH_HISTORY_GUARD_KEY = "bodeumAuthGuard";
const AUTH_HISTORY_GUARD_DEPTH = 24;

type AuthHistoryGuard = {
  id: string;
  index: number;
};

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

function wait(delay: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function isUnauthorizedError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function isRetryableError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === undefined || status >= 500;
}

async function requestWithRetry<T>(request: () => Promise<T>) {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= ONBOARDING_RESUME_RETRY_DELAYS.length;
    attempt += 1
  ) {
    try {
      return await request();
    } catch (error: unknown) {
      lastError = error;
      const retryDelay = ONBOARDING_RESUME_RETRY_DELAYS[attempt];

      if (retryDelay === undefined || !isRetryableError(error)) {
        break;
      }

      await wait(retryDelay);
    }
  }

  throw lastError ?? new Error("요청을 처리하지 못했습니다.");
}

export default function AuthPage() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const navigationTypeRef = useRef(navigationType);
  navigationTypeRef.current = navigationType;
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFlow = resolveRequestedAuthFlow(searchParams.get("flow"));
  const isProfileOnboardingRequested =
    requestedFlow === "onboarding" &&
    searchParams.get("source") === "profile";
  const [isProfileOnboardingConfirmed, setIsProfileOnboardingConfirmed] =
    useState(false);
  const storedNextStep = hasStoredAuthSession()
    ? getStoredAuthNextStep()
    : null;
  const flow = resolveAuthPageFlow({
    requestedFlow,
    storedNextStep,
    isProfileOnboardingRequested,
  });
  const isProfileOnboarding =
    isProfileOnboardingRequested && isProfileOnboardingConfirmed;
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [onboardingForm, setOnboardingForm] =
    useState<OnboardingFormState>(createEmptyOnboardingDraft);
  const [modal, setModal] = useState<OnboardingModal>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(
    () => flow !== "login" || hasStoredAuthSession(),
  );
  const [onboardingLoadError, setOnboardingLoadError] = useState<
    string | null
  >(null);
  const [onboardingLoadRetry, setOnboardingLoadRetry] = useState(0);
  const [isBackGuardActive, setIsBackGuardActive] = useState(false);
  const requestInFlight = useRef(false);
  const browserBackInFlight = useRef(false);
  const authHistoryGuardId = useRef<string | null>(null);
  const isCollapsingAuthHistory = useRef(false);
  const lastBrowserBackAt = useRef(0);
  const protectedFlowWasVisible = useRef(false);
  const interruptedAgreement = useRef<Promise<boolean> | null>(null);
  const interruptedOnboarding = useRef<Promise<boolean> | null>(null);

  if (interruptedAgreement.current === null) {
    interruptedAgreement.current = wasAgreementBrowserSessionInterrupted();
  }

  if (interruptedOnboarding.current === null) {
    interruptedOnboarding.current = wasOnboardingBrowserSessionInterrupted();
  }
  const showAgreementBackBlockedToast = useCallback(() => {
    showToast(
      "red",
      "필수 약관 동의를 완료해야 회원가입을 계속할 수 있습니다.",
    );
  }, []);

  useEffect(() => {
    if (isCollapsingAuthHistory.current) {
      return;
    }

    if (!hasStoredAuthSession()) {
      setIsInitializing(false);
      setOnboardingLoadError(null);

      if (requestedFlow !== "login") {
        setSearchParams({}, { replace: true });
      }

      return;
    }

    let cancelled = false;
    setIsInitializing(true);
    setOnboardingLoadError(null);

    const restoreAuthState = async () => {
      try {
        const storedNextStep = getStoredAuthNextStep();

        if (isProfileOnboardingRequested) {
          const status = await requestWithRetry(getOnboardingStatus);

          if (cancelled) {
            return;
          }

          storeAuthNextStep(status.nextStep);
          const destination = resolveProfileOnboardingDestination(status);

          if (destination === "agreement") {
            setIsProfileOnboardingConfirmed(false);
            clearOnboardingBrowserSession();
            setSearchParams({ flow: "agreement" }, { replace: true });
            return;
          }

          if (destination === "onboarding") {
            setIsProfileOnboardingConfirmed(false);
            clearAgreementBrowserSession();
            setSearchParams({ flow: "onboarding" }, { replace: true });
            return;
          }

          if (destination === "home") {
            setIsProfileOnboardingConfirmed(false);
            clearAgreementBrowserSession();
            clearOnboardingBrowserSession();
            navigate("/", { replace: true });
            return;
          }

          const resume = await requestWithRetry(() =>
            getOnboardingResume({ allowResolved: true, status }),
          );

          if (cancelled) {
            return;
          }

          setIsProfileOnboardingConfirmed(true);
          clearAgreementBrowserSession();
          clearOnboardingBrowserSession();
          setOnboardingStep(resume.step);
          setOnboardingForm(resume.form);
          setIsInitializing(false);
          return;
        }

        if (storedNextStep === "HOME") {
          clearAgreementBrowserSession();
          clearOnboardingBrowserSession();
          navigate("/", { replace: true });
          return;
        }

        if (storedNextStep === "TERMS") {
          clearOnboardingBrowserSession();

          if (requestedFlow !== "agreement") {
            if (
              navigationTypeRef.current === "POP" &&
              protectedFlowWasVisible.current
            ) {
              showAgreementBackBlockedToast();
            }

            setSearchParams({ flow: "agreement" }, { replace: true });
            return;
          }

          setIsInitializing(false);
          return;
        }

        if (storedNextStep === "ONBOARDING") {
          clearAgreementBrowserSession();
          const onboardingWasInterrupted =
            await interruptedOnboarding.current;

          if (cancelled) {
            return;
          }

          if (
            (onboardingWasInterrupted ||
              (navigationTypeRef.current === "POP" &&
                requestedFlow !== "onboarding"))
          ) {
            const result = await requestWithRetry(
              completeInterruptedOnboarding,
            );

            if (result.nextStep !== "HOME") {
              throw new Error(
                "중단된 온보딩의 건너뛰기 상태를 확인하지 못했습니다.",
              );
            }

            storeAuthNextStep("HOME");
            clearOnboardingBrowserSession();

            if (!cancelled) {
              showToast(
                "blue",
                "가입이 완료되었습니다. 보듬에 오신 것을 환영합니다!",
              );
              navigate("/", { replace: true });
            }
            return;
          }

          if (requestedFlow !== "onboarding") {
            setSearchParams({ flow: "onboarding" }, { replace: true });
            return;
          }

          const resume = await requestWithRetry(() =>
            getOnboardingResume(),
          );

          if (cancelled) {
            return;
          }

          if (resume.nextStep === "HOME") {
            storeAuthNextStep("HOME");
            clearOnboardingBrowserSession();
            navigate("/", { replace: true });
            return;
          }

          setOnboardingStep(resume.step);
          setOnboardingForm(resume.form);
          setIsInitializing(false);
          return;
        }

        const status = await requestWithRetry(getOnboardingStatus);

        if (cancelled) {
          return;
        }

        if (status.nextStep === "HOME") {
          clearAgreementBrowserSession();
          storeAuthNextStep("HOME");
          clearOnboardingBrowserSession();
          navigate("/", { replace: true });
          return;
        }

        if (status.nextStep === "ONBOARDING") {
          clearAgreementBrowserSession();
          storeAuthNextStep("ONBOARDING");
          setOnboardingLoadRetry((current) => current + 1);
          return;
        }

        storeAuthNextStep("TERMS");
        clearOnboardingBrowserSession();

        if (requestedFlow !== "agreement") {
          setSearchParams({ flow: "agreement" }, { replace: true });
          return;
        }

        setIsInitializing(false);
      } catch (error: unknown) {
        if (isUnauthorizedError(error)) {
          if (!cancelled) {
            showToast("red", "로그인이 만료되었습니다. 다시 로그인해주세요.");
            setIsInitializing(false);
            setOnboardingLoadError(null);
            setSearchParams({}, { replace: true });
          }
          return;
        }

        if (!cancelled) {
          setOnboardingLoadError(
            getApiErrorMessage(
              error,
              "로그인 및 온보딩 진행 정보를 불러오지 못했습니다.",
            ),
          );
          setIsInitializing(false);
        }
      }
    };

    void restoreAuthState();

    return () => {
      cancelled = true;
    };
  }, [
    isProfileOnboardingRequested,
    navigate,
    onboardingLoadRetry,
    requestedFlow,
    setSearchParams,
    showAgreementBackBlockedToast,
  ]);

  useEffect(() => {
    if (
      !isInitializing &&
      !onboardingLoadError &&
      (flow === "agreement" ||
        (flow === "onboarding" && !isProfileOnboarding))
    ) {
      protectedFlowWasVisible.current = true;
      setIsBackGuardActive(true);
    }
  }, [flow, isInitializing, isProfileOnboarding, onboardingLoadError]);

  useEffect(() => {
    const restoreFromBackForwardCache = (event: PageTransitionEvent) => {
      if (!event.persisted || !hasStoredAuthSession()) {
        return;
      }

      interruptedAgreement.current =
        wasAgreementBrowserSessionInterrupted();
      interruptedOnboarding.current =
        wasOnboardingBrowserSessionInterrupted();
      setIsInitializing(true);
      setOnboardingLoadRetry((current) => current + 1);
    };

    window.addEventListener("pageshow", restoreFromBackForwardCache);

    return () => {
      window.removeEventListener("pageshow", restoreFromBackForwardCache);
    };
  }, []);

  useEffect(() => {
    if (flow !== "agreement" || isInitializing || onboardingLoadError) {
      return;
    }

    let cancelled = false;

    void interruptedAgreement.current?.then((wasInterrupted) => {
      if (cancelled) {
        return;
      }

      startAgreementBrowserSession();

      if (
        wasInterrupted ||
        consumeAgreementInterruptedLogoutNotice()
      ) {
        showToast("red", "약관 동의 전 브라우저를 종료하셨어요");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [flow, isInitializing, onboardingLoadError]);

  useEffect(() => {
    if (
      flow !== "onboarding" ||
      isProfileOnboarding ||
      isInitializing ||
      onboardingLoadError
    ) {
      return;
    }

    startOnboardingBrowserSession();
  }, [
    flow,
    isInitializing,
    isProfileOnboarding,
    onboardingLoadError,
  ]);

  const retryOnboardingLoad = () => {
    setOnboardingLoadRetry((current) => current + 1);
  };

  const setFlow = (nextFlow: AuthFlow) => {
    if (nextFlow === "login") {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ flow: nextFlow }, { replace: true });
  };

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
        if (settled) {
          return;
        }

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

  const completeOnboarding = useCallback(
    async (nickname?: string) => {
      await collapseAuthHistory();
      const displayNickname = nickname?.trim();

      showToast(
        "blue",
        isProfileOnboarding
          ? "맞춤 프로필이 저장되었습니다."
          : displayNickname
          ? `${displayNickname}님, 환영합니다! 보듬이 보호자님의 곁에서 함께하겠습니다`
          : "가입이 완료되었습니다. 보듬에 오신 것을 환영합니다!",
      );
      storeAuthNextStep("HOME");
      clearAgreementBrowserSession();
      clearOnboardingBrowserSession();
      navigate("/", { replace: true });
    },
    [collapseAuthHistory, isProfileOnboarding, navigate],
  );

  const waitForBrowserBackToSettle = useCallback(async () => {
    while (true) {
      const remaining =
        lastBrowserBackAt.current + BROWSER_BACK_SETTLE_MS - Date.now();

      if (remaining <= 0) {
        return;
      }

      await wait(remaining);
    }
  }, []);

  const runRequest = async (
    request: () => Promise<void>,
    fallbackMessage: string,
  ) => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;
    setIsSubmitting(true);

    try {
      await request();
    } catch (error) {
      showToast("red", getApiErrorMessage(error, fallbackMessage));
    } finally {
      requestInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;
    flushSync(() => {
      setIsSubmitting(true);
      setIsInitializing(true);
    });

    try {
      startSocialLogin(provider);
    } catch (error) {
      requestInFlight.current = false;
      setIsSubmitting(false);
      setIsInitializing(false);
      showToast(
        "red",
        getApiErrorMessage(error, "로그인 페이지로 이동하지 못했습니다."),
      );
    }
  };

  const handleAgreementSubmit = (agreements: AgreementFormValues) => {
    void runRequest(async () => {
      const result = await submitAgreements(agreements);
      storeAuthNextStep(result.nextStep);
      clearAgreementBrowserSession();

      if (result.nextStep === "HOME") {
        await completeOnboarding();
        return;
      }

      if (result.nextStep !== "ONBOARDING") {
        throw new Error("약관 동의 후 진행 상태를 확인하지 못했습니다.");
      }

      setFlow("onboarding");
    }, "약관 동의를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const moveNextOnboardingStep = () => {
    void runRequest(async () => {
      if (onboardingStep === 1) {
        const result = await registerChildProfile(onboardingForm);

        if (result.nextStep === "HOME") {
          await completeOnboarding();
          return;
        }

        setOnboardingStep(2);
        return;
      }

      if (onboardingStep === 2) {
        const result = await registerInterestRegion(onboardingForm);

        if (result.nextStep === "HOME") {
          await completeOnboarding();
          return;
        }

        setOnboardingStep(3);
        return;
      }

      const result = await registerGuardianProfile(onboardingForm);

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 완료 상태를 확인하지 못했습니다.");
      }

      await completeOnboarding(onboardingForm.guardianNickname);
    }, "온보딩 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const movePrevOnboardingStep = () => {
    setOnboardingStep((currentStep) =>
      Math.max(1, currentStep - 1) as OnboardingStep,
    );
  };

  const handleQuitOnboarding = () => {
    if (isProfileOnboarding) {
      setModal(null);
      navigate("/", { replace: true });
      return;
    }

    void runRequest(async () => {
      const result = await quitOnboarding();

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 중단 상태를 확인하지 못했습니다.");
      }

      setOnboardingForm(createEmptyOnboardingDraft());
      setModal(null);
      await completeOnboarding();
    }, "온보딩을 중단하지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const handleSkipOnboarding = () => {
    if (isProfileOnboarding) {
      setModal(null);
      navigate("/", { replace: true });
      return;
    }

    void runRequest(async () => {
      const result = await skipOnboarding();

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 건너뛰기 상태를 확인하지 못했습니다.");
      }

      setModal(null);
      await completeOnboarding();
    }, "온보딩을 건너뛰지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const shouldProtectAuthHistory =
    hasStoredAuthSession() &&
    !onboardingLoadError &&
    (isBackGuardActive || !isInitializing) &&
    (flow === "agreement" ||
      (flow === "onboarding" && !isProfileOnboarding));
  const keepOnboardingVisible =
    flow === "onboarding" &&
    isBackGuardActive &&
    !isProfileOnboarding &&
    !onboardingLoadError;

  useEffect(() => {
    if (!shouldProtectAuthHistory) {
      return;
    }

    const handleBrowserBack = () => {
      if (isCollapsingAuthHistory.current) {
        return;
      }

      lastBrowserBackAt.current = Date.now();
      const guardId = authHistoryGuardId.current;
      const currentGuard = getAuthHistoryGuard();

      if (guardId) {
        const nextIndex =
          currentGuard?.id === guardId ? currentGuard.index + 1 : 1;
        const protectedUrl =
          flow === "agreement"
            ? "/auth?flow=agreement"
            : "/auth?flow=onboarding";

        window.history.pushState(
          createAuthHistoryState({ id: guardId, index: nextIndex }),
          "",
          protectedUrl,
        );
      }

      if (flow === "agreement") {
        showAgreementBackBlockedToast();
        return;
      }

      if (flow !== "onboarding" || browserBackInFlight.current) {
        return;
      }

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
          setModal(null);
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
    flow,
    isProfileOnboarding,
    shouldProtectAuthHistory,
    showAgreementBackBlockedToast,
    waitForBrowserBackToSettle,
  ]);

  useEffect(() => {
    if (!shouldProtectAuthHistory || authHistoryGuardId.current) {
      return;
    }

    const existingGuard = getAuthHistoryGuard();

    if (existingGuard) {
      authHistoryGuardId.current = existingGuard.id;
      return;
    }

    const guardId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const protectedUrl =
      flow === "agreement"
        ? "/auth?flow=agreement"
        : "/auth?flow=onboarding";

    authHistoryGuardId.current = guardId;
    window.history.replaceState(
      createAuthHistoryState({ id: guardId, index: 0 }),
      "",
      protectedUrl,
    );

    for (let index = 1; index <= AUTH_HISTORY_GUARD_DEPTH; index += 1) {
      window.history.pushState(
        createAuthHistoryState({ id: guardId, index }),
        "",
        protectedUrl,
      );
    }
  }, [flow, shouldProtectAuthHistory]);

  return (
    <main
      className={[
        "relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto px-[20px] py-[40px] max-sm:px-[16px] max-sm:py-[24px]",
        flow === "onboarding" ? "bg-background-500" : "bg-main-150",
      ].join(" ")}
    >
      {isInitializing && !keepOnboardingVisible && (
        <AuthLoadingState
          message={
            flow === "onboarding"
              ? "온보딩 정보를 불러오고 있습니다."
              : "로그인 상태를 확인하고 있습니다."
          }
          tone={flow === "onboarding" ? "inverse" : "default"}
        />
      )}

      {!isInitializing && onboardingLoadError && (
        <AuthLoadErrorState
          message={onboardingLoadError}
          onRetry={retryOnboardingLoad}
        />
      )}

      {!isInitializing && !onboardingLoadError && flow === "login" && (
        <AuthLoginCard
          onAuthenticate={handleSocialLogin}
          isRedirecting={isSubmitting}
        />
      )}

      {!isInitializing && !onboardingLoadError && flow === "agreement" && (
        <AuthAgreementCard
          onSubmit={handleAgreementSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {flow === "onboarding" &&
        (!isInitializing || keepOnboardingVisible) &&
        !onboardingLoadError && (
        <OnboardingStepCard
          step={onboardingStep}
          form={onboardingForm}
          onChange={setOnboardingForm}
          onPrev={movePrevOnboardingStep}
          onNext={moveNextOnboardingStep}
          onClose={() => setModal("cancel")}
          onSkip={() => setModal("skip")}
          isSubmitting={isSubmitting || isInitializing}
        />
      )}

      {modal === "cancel" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title={
              isProfileOnboarding
                ? "맞춤 프로필 작성을 중단하시겠어요?"
                : "온보딩을 중단하시겠어요?"
            }
            description={
              isProfileOnboarding
                ? `기존에 저장된 맞춤 프로필 정보는 그대로 유지됩니다.\n현재 단계에서 작성 중인 내용은 저장되지 않습니다.`
                : `중단하면 지금까지 작성한 모든 온보딩 정보가 삭제됩니다.\n맞춤형 서비스 이용을 위한 기본 정보는 로그인 후\n[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`
            }
            leftButtonText="계속하기"
            rightButtonText={isSubmitting ? "처리 중..." : "중단하기"}
            className="z-[70]!"
            leftButtonDisabled={isSubmitting}
            rightButtonDisabled={isSubmitting}
            onLeftButtonClick={() => setModal(null)}
            onRightButtonClick={handleQuitOnboarding}
          />
        </div>
      )}

      {modal === "skip" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title={
              isProfileOnboarding
                ? "맞춤 프로필 작성을 건너뛰시겠어요?"
                : "온보딩을 건너뛰시겠어요?"
            }
            description={
              isProfileOnboarding
                ? `기존에 저장된 맞춤 프로필 정보는 그대로 유지됩니다.\n현재 단계에서 작성 중인 내용은 저장되지 않습니다.`
                : `현재 단계에서 작성 중인 내용은 저장되지 않으며,\n이전 단계에서 저장한 정보는 그대로 유지됩니다.\n나머지 정보는 [마이페이지 > 설정]에서 언제든 작성할 수 있습니다.`
            }
            leftButtonText="계속하기"
            rightButtonText={isSubmitting ? "처리 중..." : "건너뛰기"}
            className="z-[70]!"
            leftButtonDisabled={isSubmitting}
            rightButtonDisabled={isSubmitting}
            onLeftButtonClick={() => setModal(null)}
            onRightButtonClick={handleSkipOnboarding}
          />
        </div>
      )}
    </main>
  );
}
