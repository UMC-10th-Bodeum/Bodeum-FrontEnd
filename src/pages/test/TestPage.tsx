import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAiTermsAgreement,
  type AiTermsAgreement,
} from "@/apis/aiChatApi";
import { clearAuthTokens } from "@/apis/authApi";
import { getApiErrorMessage } from "@/apis/apiError";
import {
  getMyProfile,
  getUserBrief,
  withdrawCurrentUser,
  type UserBrief,
  type UserProfile,
} from "@/apis/userApi";
import {
  getOnboardingStatus,
  type OnboardingStatusResponse,
} from "@/apis/onboardingApi";
import { showToast } from "@/components/Toast";
import { clearAgreementBrowserSession } from "@/pages/auth/agreementBrowserSession";
import { clearAuthProgress } from "@/pages/auth/authProgressStorage";
import { clearOnboardingBrowserSession } from "@/pages/auth/onboardingBrowserSession";
import WithdrawalModal from "@/pages/mypage/settings/components/WithdrawalModal";

type TestData = {
  brief: UserBrief;
  profile: UserProfile | null;
  onboarding: OnboardingStatusResponse | null;
  aiTerms: AiTermsAgreement | null;
};

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-[10px] py-[5px] text-body-sub ${
        active
          ? "bg-main-150 text-main-500"
          : "bg-background-250 text-background-500"
      }`}
    >
      {label}
    </span>
  );
}

function JsonCard({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="rounded-[12px] border border-background-250 bg-background-100 p-[20px]">
      <h2 className="mb-[12px] text-h2-list text-background-600">{title}</h2>
      <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap break-all rounded-[8px] bg-background-200 p-[16px] text-body-sub text-background-600">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

export default function TestPage() {
  const navigate = useNavigate();
  const withdrawalInFlightRef = useRef(false);
  const [data, setData] = useState<TestData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const loadTestData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const brief = await getUserBrief();

      if (!brief.isLoggedIn) {
        setData({ brief, profile: null, onboarding: null, aiTerms: null });
        return;
      }

      const [profile, onboarding, aiTerms] = await Promise.all([
        getMyProfile(),
        getOnboardingStatus(),
        getAiTermsAgreement(),
      ]);

      setData({ brief, profile, onboarding, aiTerms });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "테스트용 사용자 정보를 불러오지 못했습니다.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTestData();
  }, [loadTestData]);

  const handleWithdrawal = async () => {
    if (withdrawalInFlightRef.current) return;
    withdrawalInFlightRef.current = true;

    try {
      const result = await withdrawCurrentUser();
      if (!result.success) {
        throw new Error("서버가 탈퇴 완료 상태를 반환하지 않았습니다.");
      }

      clearAuthTokens();
      clearAuthProgress();
      clearAgreementBrowserSession();
      clearOnboardingBrowserSession();
      setIsWithdrawalModalOpen(false);
      showToast("green", "회원 탈퇴가 완료되었습니다.");
      await loadTestData();
    } catch (error) {
      setIsWithdrawalModalOpen(false);
      showToast(
        "red",
        getApiErrorMessage(error, "회원 탈퇴에 실패했습니다."),
      );
    } finally {
      withdrawalInFlightRef.current = false;
    }
  };

  const isLoggedIn = data?.brief.isLoggedIn === true;
  const requiredTermsAgreed =
    data?.onboarding !== null && data?.onboarding.nextStep !== "TERMS";

  return (
    <main className="min-h-screen bg-background-200 px-[32px] py-[32px]">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[20px]">
        <header className="flex flex-wrap items-center justify-between gap-[16px] rounded-[12px] bg-background-100 p-[24px] shadow-[1px_1px_10px_rgba(0,0,0,0.06)]">
          <div>
            <p className="mb-[4px] text-body-sub text-sub-red">
              개발 전용 임시 페이지
            </p>
            <h1 className="text-h1-onboard text-background-600">
              계정·약관 API 테스트
            </h1>
          </div>

          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() => void loadTestData()}
              disabled={isLoading}
              className="cursor-pointer rounded-[10px] border border-main-400 bg-background-100 px-[16px] py-[10px] text-h4-list text-main-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "조회 중..." : "다시 조회"}
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="cursor-pointer rounded-[10px] bg-main-400 px-[16px] py-[10px] text-h4-list text-background-100"
              >
                로그인하기
              </button>
            )}
          </div>
        </header>

        {errorMessage && (
          <div className="rounded-[10px] border border-sub-red bg-background-100 p-[16px] text-h4-list text-sub-red">
            {errorMessage}
          </div>
        )}

        <section className="rounded-[12px] border border-background-250 bg-background-100 p-[20px]">
          <div className="mb-[16px] flex items-center justify-between gap-[12px]">
            <h2 className="text-h2-list text-background-600">현재 상태</h2>
            <StatusBadge
              active={isLoggedIn}
              label={isLoggedIn ? "로그인" : "비로그인"}
            />
          </div>

          {isLoading && !data ? (
            <p className="text-h4-list text-background-500">
              계정 정보를 조회하고 있습니다.
            </p>
          ) : isLoggedIn ? (
            <div className="grid grid-cols-1 gap-[12px] md:grid-cols-3">
              <div className="rounded-[10px] bg-background-200 p-[16px]">
                <p className="mb-[8px] text-body-sub text-background-500">
                  서비스 이용약관
                </p>
                <StatusBadge
                  active={requiredTermsAgreed}
                  label={requiredTermsAgreed ? "동의 완료" : "미동의"}
                />
              </div>
              <div className="rounded-[10px] bg-background-200 p-[16px]">
                <p className="mb-[8px] text-body-sub text-background-500">
                  개인정보처리방침
                </p>
                <StatusBadge
                  active={requiredTermsAgreed}
                  label={requiredTermsAgreed ? "동의 완료" : "미동의"}
                />
              </div>
              <div className="rounded-[10px] bg-background-200 p-[16px]">
                <p className="mb-[8px] text-body-sub text-background-500">
                  AI 챗봇 이용 동의
                </p>
                <StatusBadge
                  active={data?.aiTerms?.aiTermsAgreed === true}
                  label={
                    data?.aiTerms?.aiTermsAgreed ? "동의 완료" : "미동의"
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-h4-list text-background-500">
              로그인하면 내 정보와 약관 동의 여부를 조회할 수 있습니다.
            </p>
          )}

          {isLoggedIn && (
            <p className="mt-[14px] text-body-sub text-background-500">
              서비스 이용약관과 개인정보처리방침은 개별 조회 API가 없어
              온보딩 nextStep을 기준으로 표시합니다. AI 약관은 전용 조회 API의
              실제 값입니다.
            </p>
          )}
        </section>

        {data && (
          <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
            <JsonCard title="내 정보 요약 /me/brief" value={data.brief} />
            <JsonCard title="내 프로필 /me/profile" value={data.profile} />
            <JsonCard
              title="온보딩 상태 /me/onboarding-status"
              value={data.onboarding}
            />
            <JsonCard title="AI 약관 /me/ai-terms" value={data.aiTerms} />
          </div>
        )}

        {isLoggedIn && (
          <section className="rounded-[12px] border border-sub-red bg-background-100 p-[20px]">
            <h2 className="mb-[8px] text-h2-list text-sub-red">
              회원 탈퇴 API
            </h2>
            <p className="mb-[16px] text-h4-list text-background-500">
              실제 계정과 관련 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="cursor-pointer rounded-[10px] bg-sub-red px-[18px] py-[10px] text-h4-list text-background-100"
            >
              탈퇴 API 테스트
            </button>
          </section>
        )}
      </div>

      {isWithdrawalModalOpen && (
        <WithdrawalModal
          onClose={() => setIsWithdrawalModalOpen(false)}
          onConfirm={() => void handleWithdrawal()}
        />
      )}
    </main>
  );
}
