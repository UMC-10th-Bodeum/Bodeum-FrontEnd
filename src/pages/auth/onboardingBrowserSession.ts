import { skipOnboarding } from "@/apis/onboardingApi";
import { createBrowserFlowSession } from "./browserFlowSession";

let interruptedSkipPromise: ReturnType<typeof skipOnboarding> | null = null;
const onboardingSession = createBrowserFlowSession({ flowName: "onboarding" });

export function startOnboardingBrowserSession() {
  onboardingSession.start();
}

export function clearOnboardingBrowserSession() {
  onboardingSession.clear();
}

export function wasOnboardingBrowserSessionInterrupted() {
  return onboardingSession.wasInterrupted();
}

export function shouldCheckOnboardingBrowserSessionInterruption() {
  return onboardingSession.shouldCheckInterruption();
}

export function completeInterruptedOnboarding() {
  if (!interruptedSkipPromise) {
    interruptedSkipPromise = skipOnboarding().finally(() => {
      interruptedSkipPromise = null;
    });
  }

  return interruptedSkipPromise;
}
