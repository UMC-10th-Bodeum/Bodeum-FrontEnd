import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getApiErrorMessage } from "@/apis/apiError";
import {
  startSocialLogin,
  submitAgreements,
  type AgreementFormValues,
  type SocialProvider,
} from "@/apis/authApi";
import {
  createEmptyOnboardingDraft,
  getOnboardingResume,
  quitOnboarding,
  registerChildProfile,
  registerGuardianProfile,
  registerInterestRegion,
  skipOnboarding,
} from "@/apis/onboardingApi";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";

import AuthAgreementCard from "./components/AuthAgreementCard";
import AuthLoadingState from "./components/AuthLoadingState";
import AuthLoginCard from "./components/AuthLoginCard";
import OnboardingStepCard from "./components/OnboardingStepCard";
import type {
  OnboardingFormState,
  OnboardingStep,
} from "./components/OnboardingStepCard";

type AuthFlow = "login" | "agreement" | "onboarding";
type OnboardingModal = "cancel" | "skip" | null;

function resolveAuthFlow(value: string | null): AuthFlow {
  if (value === "agreement" || value === "onboarding") {
    return value;
  }

  return "login";
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const flow = resolveAuthFlow(searchParams.get("flow"));
  const isProfileOnboarding = searchParams.get("source") === "profile";
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [onboardingForm, setOnboardingForm] =
    useState<OnboardingFormState>(createEmptyOnboardingDraft);
  const [modal, setModal] = useState<OnboardingModal>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(
    flow === "onboarding",
  );
  const requestInFlight = useRef(false);

  useEffect(() => {
    if (flow !== "onboarding") {
      setIsInitializing(false);
      return;
    }

    let cancelled = false;
    setIsInitializing(true);

    void getOnboardingResume({ allowResolved: isProfileOnboarding })
      .then((resume) => {
        if (cancelled) {
          return;
        }

        if (resume.nextStep === "HOME") {
          navigate("/", { replace: true });
          return;
        }

        if (resume.nextStep === "TERMS") {
          setSearchParams({ flow: "agreement" }, { replace: true });
          return;
        }

        setOnboardingStep(resume.step);
        setOnboardingForm(resume.form);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          showToast(
            "red",
            getApiErrorMessage(
              error,
              "온보딩 진행 정보를 불러오지 못했습니다.",
            ),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsInitializing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [flow, isProfileOnboarding, navigate, setSearchParams]);

  const setFlow = (nextFlow: AuthFlow) => {
    if (nextFlow === "login") {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ flow: nextFlow }, { replace: true });
  };

  const goHome = () => {
    navigate("/");
  };

  const completeOnboarding = (nickname = "보호자") => {
    const displayNickname = nickname.trim() || "보호자";

    showToast(
      "blue",
      `${displayNickname}님, 환영합니다! 보듬이 보호자님의 곁에서 함께하겠습니다`,
    );
    navigate("/");
  };

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
    setIsSubmitting(true);

    try {
      startSocialLogin(provider);
    } catch (error) {
      requestInFlight.current = false;
      setIsSubmitting(false);
      showToast(
        "red",
        getApiErrorMessage(error, "로그인 페이지로 이동하지 못했습니다."),
      );
    }
  };

  const handleAgreementSubmit = (agreements: AgreementFormValues) => {
    void runRequest(async () => {
      const result = await submitAgreements(agreements);

      if (result.nextStep === "HOME") {
        goHome();
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
          completeOnboarding();
          return;
        }

        setOnboardingStep(2);
        return;
      }

      if (onboardingStep === 2) {
        const result = await registerInterestRegion(onboardingForm);

        if (result.nextStep === "HOME") {
          completeOnboarding();
          return;
        }

        setOnboardingStep(3);
        return;
      }

      const result = await registerGuardianProfile(onboardingForm);

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 완료 상태를 확인하지 못했습니다.");
      }

      completeOnboarding(onboardingForm.guardianNickname);
    }, "온보딩 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const movePrevOnboardingStep = () => {
    setOnboardingStep((currentStep) =>
      Math.max(1, currentStep - 1) as OnboardingStep,
    );
  };

  const handleQuitOnboarding = () => {
    void runRequest(async () => {
      const result = await quitOnboarding();

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 중단 상태를 확인하지 못했습니다.");
      }

      setOnboardingForm(createEmptyOnboardingDraft());
      setModal(null);
      goHome();
    }, "온보딩을 중단하지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  const handleSkipOnboarding = () => {
    void runRequest(async () => {
      const result = await skipOnboarding();

      if (result.nextStep !== "HOME") {
        throw new Error("온보딩 건너뛰기 상태를 확인하지 못했습니다.");
      }

      setModal(null);
      completeOnboarding();
    }, "온보딩을 건너뛰지 못했습니다. 잠시 후 다시 시도해주세요.");
  };

  return (
    <main
      className={[
        "relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto px-[20px] py-[40px] max-sm:px-[16px] max-sm:py-[24px]",
        flow === "onboarding" ? "bg-background-500" : "bg-main-150",
      ].join(" ")}
    >
      {flow === "login" && (
        <AuthLoginCard
          onAuthenticate={handleSocialLogin}
          isRedirecting={isSubmitting}
        />
      )}

      {flow === "agreement" && (
        <AuthAgreementCard
          onSubmit={handleAgreementSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {flow === "onboarding" && isInitializing && (
        <AuthLoadingState message="온보딩 정보를 불러오고 있습니다." />
      )}

      {flow === "onboarding" && !isInitializing && (
        <OnboardingStepCard
          step={onboardingStep}
          form={onboardingForm}
          onChange={setOnboardingForm}
          onPrev={movePrevOnboardingStep}
          onNext={moveNextOnboardingStep}
          onClose={() => setModal("cancel")}
          onSkip={() => setModal("skip")}
          isSubmitting={isSubmitting}
        />
      )}

      {modal === "cancel" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title="온보딩을 중단하시겠어요?"
            description={`중단하면 지금까지 작성한 모든 온보딩 정보가 삭제됩니다.\n맞춤형 서비스 이용을 위한 기본 정보는 로그인 후\n[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`}
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
            title="온보딩을 건너뛰시겠어요?"
            description={`현재 단계에서 작성 중인 내용은 저장되지 않으며,\n이전 단계에서 저장한 정보는 그대로 유지됩니다.\n나머지 정보는 [마이페이지 > 설정]에서 언제든 작성할 수 있습니다.`}
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
