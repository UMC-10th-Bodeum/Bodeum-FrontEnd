import type { NextStep } from "@/types/api";

const AUTH_NEXT_STEP_KEY = "bodeum:auth-next-step";
const LOGIN_TOAST_KEY = "bodeum:pending-login-toast";
const LOGOUT_TOAST_KEY = "bodeum:pending-logout-toast";

type PendingLoginToast = {
  nickname: string;
};

type PendingLogoutToast = {
  color: "green" | "yellow";
  message: string;
};

export function getStoredAuthNextStep(): NextStep | null {
  const nextStep = localStorage.getItem(AUTH_NEXT_STEP_KEY);

  if (
    nextStep === "TERMS" ||
    nextStep === "ONBOARDING" ||
    nextStep === "HOME"
  ) {
    return nextStep;
  }

  localStorage.removeItem(AUTH_NEXT_STEP_KEY);
  return null;
}

export function storeAuthNextStep(nextStep: NextStep) {
  localStorage.setItem(AUTH_NEXT_STEP_KEY, nextStep);
}

export function clearStoredAuthNextStep() {
  localStorage.removeItem(AUTH_NEXT_STEP_KEY);
}

export function queueLoginToast(nickname?: string | null) {
  const toast: PendingLoginToast = {
    nickname: nickname?.trim() ?? "",
  };

  sessionStorage.setItem(LOGIN_TOAST_KEY, JSON.stringify(toast));
}

export function consumeLoginToast(): PendingLoginToast | null {
  const storedToast = sessionStorage.getItem(LOGIN_TOAST_KEY);
  sessionStorage.removeItem(LOGIN_TOAST_KEY);

  if (!storedToast) {
    return null;
  }

  try {
    return JSON.parse(storedToast) as PendingLoginToast;
  } catch {
    return { nickname: "" };
  }
}

export function queueLogoutToast(
  color: PendingLogoutToast["color"],
  message: string,
) {
  sessionStorage.setItem(
    LOGOUT_TOAST_KEY,
    JSON.stringify({ color, message } satisfies PendingLogoutToast),
  );
}

export function consumeLogoutToast(): PendingLogoutToast | null {
  const storedToast = sessionStorage.getItem(LOGOUT_TOAST_KEY);
  sessionStorage.removeItem(LOGOUT_TOAST_KEY);

  if (!storedToast) {
    return null;
  }

  try {
    const toast = JSON.parse(storedToast) as Partial<PendingLogoutToast>;

    if (
      (toast.color !== "green" && toast.color !== "yellow") ||
      typeof toast.message !== "string"
    ) {
      return null;
    }

    return { color: toast.color, message: toast.message };
  } catch {
    return null;
  }
}

export function clearAuthProgress() {
  clearStoredAuthNextStep();
  sessionStorage.removeItem(LOGIN_TOAST_KEY);
}
