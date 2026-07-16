import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";

import AuthAgreementCard from "./components/AuthAgreementCard";
import AuthLoginCard from "./components/AuthLoginCard";
import OnboardingStepCard from "./components/OnboardingStepCard";
import type {
  OnboardingFormState,
  OnboardingStep,
} from "./components/OnboardingStepCard";

type AuthFlow = "login" | "agreement" | "onboarding";
type OnboardingModal = "cancel" | "skip" | null;

const initialOnboardingForm: OnboardingFormState = {
  childName: "",
  birthYear: "",
  birthMonth: "",
  careAreas: [],
  childKeywords: "",
  interests: [],
  sido: "",
  district: "",
  guardianNickname: "",
  guardianType: "",
  guardianRole: "",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<AuthFlow>("login");
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [onboardingForm, setOnboardingForm] =
    useState<OnboardingFormState>(initialOnboardingForm);
  const [modal, setModal] = useState<OnboardingModal>(null);

  const goHome = () => {
    navigate("/");
  };

  const completeOnboarding = () => {
    const nickname = onboardingForm.guardianNickname.trim() || "보호자";

    showToast(
      "blue",
      `${nickname}님, 환영합니다! 보듬이 보호자님의 곁에서 함께하겠습니다`,
    );
    navigate("/");
  };

  const moveNextOnboardingStep = () => {
    if (onboardingStep === 3) {
      completeOnboarding();
      return;
    }

    setOnboardingStep((currentStep) => (currentStep + 1) as OnboardingStep);
  };

  const movePrevOnboardingStep = () => {
    setOnboardingStep((currentStep) =>
      Math.max(1, currentStep - 1) as OnboardingStep,
    );
  };

  return (
    <main
      className={[
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        flow === "onboarding" ? "bg-background-500" : "bg-main-150",
      ].join(" ")}
    >
      {flow === "login" && (
        <AuthLoginCard onAuthenticate={() => setFlow("agreement")} />
      )}

      {flow === "agreement" && (
        <AuthAgreementCard onSubmit={() => setFlow("onboarding")} />
      )}

      {flow === "onboarding" && (
        <OnboardingStepCard
          step={onboardingStep}
          form={onboardingForm}
          onChange={setOnboardingForm}
          onPrev={movePrevOnboardingStep}
          onNext={moveNextOnboardingStep}
          onClose={() => setModal("cancel")}
          onSkip={() => setModal("skip")}
        />
      )}

      {modal === "cancel" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <OnboardCancelBox
            title="온보딩을 중단하시겠어요?"
            description={`지금 종료하시면 작성 중이던 정보가 저장되지 않습니다.\n맞춤형 서비스 이용을 위한 기본 정보는 로그인 후\n[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`}
            leftButtonText="계속하기"
            rightButtonText="중단하기"
            className="!z-[70]"
            onLeftButtonClick={() => setModal(null)}
            onRightButtonClick={goHome}
          />
        </div>
      )}

      {modal === "skip" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <OnboardCancelBox
            title="온보딩을 건너뛰시겠어요?"
            description={`지금 종료하시면 작성 중이던 정보가 저장되지 않습니다.\n맞춤형 서비스 이용을 위한 기본 정보는 로그인 후\n[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`}
            leftButtonText="계속하기"
            rightButtonText="건너뛰기"
            className="!z-[70]"
            onLeftButtonClick={() => setModal(null)}
            onRightButtonClick={completeOnboarding}
          />
        </div>
      )}
    </main>
  );
}
