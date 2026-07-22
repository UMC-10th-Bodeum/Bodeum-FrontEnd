import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getApiErrorMessage } from "@/apis/apiError";
import {
  clearAuthTokens,
  exchangeSocialLoginCode,
  storeAuthTokens,
} from "@/apis/authApi";
import { showToast } from "@/components/Toast";

import AuthLoadingState from "./components/AuthLoadingState";

const callbackErrorMessages: Record<string, string> = {
  AUTH400_1: "지원하지 않는 로그인 방식입니다.",
  AUTH400_2: "로그인 인증 정보가 올바르지 않습니다.",
  AUTH400_5: "소셜 로그인 인증을 완료하지 못했습니다.",
  AUTH401_2: "소셜 로그인 인증에 실패했습니다.",
  AUTH401_5: "사용할 수 없는 계정입니다.",
  AUTH401_6: "로그인 요청이 만료되었습니다. 다시 시도해주세요.",
  AUTH500_1: "소셜 로그인 설정을 확인하지 못했습니다.",
};

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) {
      return;
    }

    handled.current = true;
    const callbackError = searchParams.get("error");
    const code = searchParams.get("code");

    const returnToLogin = (message: string) => {
      showToast("red", message);
      navigate("/auth", { replace: true });
    };

    if (callbackError) {
      returnToLogin(
        callbackErrorMessages[callbackError] ??
          "로그인을 완료하지 못했습니다. 다시 시도해주세요.",
      );
      return;
    }

    if (!code) {
      returnToLogin("로그인 인증 정보를 확인하지 못했습니다.");
      return;
    }

    window.history.replaceState(window.history.state, "", "/auth/callback");

    void exchangeSocialLoginCode(code)
      .then((result) => {
        storeAuthTokens(result);

        if (result.nextStep === "TERMS") {
          navigate("/auth?flow=agreement", { replace: true });
          return;
        }

        if (result.nextStep === "ONBOARDING") {
          navigate("/auth?flow=onboarding", { replace: true });
          return;
        }

        if (result.nextStep === "HOME") {
          navigate("/", { replace: true });
          return;
        }

        throw new Error("로그인 후 진행 상태를 확인하지 못했습니다.");
      })
      .catch((error: unknown) => {
        clearAuthTokens();
        returnToLogin(
          getApiErrorMessage(
            error,
            "로그인 정보를 저장하지 못했습니다. 다시 시도해주세요.",
          ),
        );
      });
  }, [navigate, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-main-150 px-[20px] py-[40px]">
      <AuthLoadingState message="로그인 정보를 확인하고 있습니다." />
    </main>
  );
}
