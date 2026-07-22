import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { clearAuthTokens } from "@/apis/authApi";
import { getApiErrorMessage } from "@/apis/apiError";
import {
  getMyProfile,
  withdrawCurrentUser,
  type CodeLabel,
  type UserProfile,
} from "@/apis/userApi";
import OnboardBoxFrame from "@/components/OnboardBoxFrame";
import { showToast } from "@/components/Toast";

const guardianTypeLabels: Record<string, string> = {
  PARENT: "부모",
  GRANDPARENT: "조부모",
  SIBLING: "형제·자매",
  ETC: "기타",
};

const communityRoleLabels: Record<string, string> = {
  INFO_SEEKER: "정보 탐색자",
  EXPERIENCE_SHARER: "경험 공유자",
  WISDOM_HELPER: "지혜 조력자",
};

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "미입력";
  }

  return String(value);
}

function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-h-[48px] grid-cols-[180px_1fr] items-center border-b border-background-250 py-[10px] last:border-b-0">
      <dt className="text-h3-onboard text-background-500">{label}</dt>
      <dd className="min-w-0 break-words text-h3-category text-background-600">
        {children}
      </dd>
    </div>
  );
}

function CodeLabelList({ items }: { items: CodeLabel[] }) {
  if (items.length === 0) {
    return <span>미입력</span>;
  }

  return (
    <div className="flex flex-wrap gap-[6px]">
      {items.map(({ code, label }) => (
        <span
          key={code}
          title={code}
          className="rounded-[4px] bg-main-200 px-[8px] py-[4px] text-h6 text-main-500"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default function AccountApiTestPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const withdrawInFlight = useRef(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setProfile(await getMyProfile());
    } catch (error) {
      setProfile(null);
      setErrorMessage(
        getApiErrorMessage(error, "회원 정보를 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleWithdraw = async () => {
    if (withdrawInFlight.current) {
      return;
    }

    withdrawInFlight.current = true;
    setIsWithdrawing(true);

    try {
      const result = await withdrawCurrentUser(withdrawReason);

      if (!result.success) {
        throw new Error("회원 탈퇴 완료 상태를 확인하지 못했습니다.");
      }

      clearAuthTokens();
      showToast("green", "회원 탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (error) {
      showToast(
        "red",
        getApiErrorMessage(error, "회원 탈퇴를 처리하지 못했습니다."),
      );
    } finally {
      withdrawInFlight.current = false;
      setIsWithdrawing(false);
    }
  };

  const region = profile
    ? [profile.regionLevel1, profile.regionLevel2]
        .filter((value, index, values) => value && values.indexOf(value) === index)
        .join(" ")
    : "";

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-100 px-[40px] py-[32px]">
      <div className="max-w-[960px]">
        <div className="flex items-center justify-between border-b-2 border-background-600 pb-[16px]">
          <div>
            <h1 className="text-h1-onboard text-background-600">
              계정 API 테스트
            </h1>
            <p className="mt-[4px] text-h3-onboard text-background-500">
              서버에 저장된 회원 및 온보딩 정보
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadProfile()}
            disabled={isLoading}
            className="rounded-[6px] border border-background-400 px-[14px] py-[8px] text-h6 text-background-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "조회 중" : "다시 조회"}
          </button>
        </div>

        {isLoading && (
          <div className="py-[80px] text-center text-h3-onboard text-background-500">
            정보를 불러오고 있습니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="border-b border-background-250 py-[48px] text-center">
            <p className="text-h3-onboard text-sub-red">{errorMessage}</p>
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="mt-[16px] rounded-[6px] bg-main-400 px-[16px] py-[9px] text-h6 text-background-100"
            >
              로그인 / 회원가입
            </button>
          </div>
        )}

        {!isLoading && profile && (
          <>
            <section className="pt-[28px]">
              <h2 className="mb-[8px] text-h2-list text-background-600">
                회원 정보
              </h2>
              <dl className="border-t border-background-400">
                <DataRow label="사용자 ID">{profile.userId}</DataRow>
                <DataRow label="닉네임">
                  {displayValue(profile.nickname)}
                </DataRow>
                <DataRow label="프로필 이미지">
                  {profile.profileImageUrl ? (
                    <a
                      href={profile.profileImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-main-400 underline"
                    >
                      {profile.profileImageUrl}
                    </a>
                  ) : (
                    "미입력"
                  )}
                </DataRow>
                <DataRow label="활동 정보">
                  {`${profile.point}P · Level${profile.level} · ${displayValue(profile.badgeName)}`}
                </DataRow>
                <DataRow label="레벨 설명">
                  {displayValue(profile.levelDescription)}
                </DataRow>
              </dl>
            </section>

            <section className="pt-[28px]">
              <h2 className="mb-[8px] text-h2-list text-background-600">
                온보딩 1단계 · 자녀 정보
              </h2>
              <dl className="border-t border-background-400">
                <DataRow label="자녀 닉네임">
                  {displayValue(profile.childProfile?.nickname)}
                </DataRow>
                <DataRow label="생년월일">
                  {displayValue(profile.childProfile?.birth)}
                </DataRow>
                <DataRow label="집중 케어 영역">
                  <CodeLabelList
                    items={profile.childProfile?.disabilityTypes ?? []}
                  />
                </DataRow>
                <DataRow label="자녀 특징 키워드">
                  {displayValue(profile.keywordText)}
                </DataRow>
              </dl>
            </section>

            <section className="pt-[28px]">
              <h2 className="mb-[8px] text-h2-list text-background-600">
                온보딩 2단계 · 관심사와 지역
              </h2>
              <dl className="border-t border-background-400">
                <DataRow label="관심사">
                  <CodeLabelList items={profile.interestCategories ?? []} />
                </DataRow>
                <DataRow label="지역">
                  {region || "미입력"}
                </DataRow>
                <DataRow label="지역 ID">
                  {displayValue(profile.regionId)}
                </DataRow>
              </dl>
            </section>

            <section className="pt-[28px]">
              <h2 className="mb-[8px] text-h2-list text-background-600">
                온보딩 3단계 · 보호자 정보
              </h2>
              <dl className="border-t border-background-400">
                <DataRow label="보호자 닉네임">
                  {displayValue(profile.guardianNickname)}
                </DataRow>
                <DataRow label="보호자 유형">
                  {profile.guardianType
                    ? (guardianTypeLabels[profile.guardianType] ??
                      profile.guardianType)
                    : "미입력"}
                </DataRow>
                <DataRow label="커뮤니티 역할">
                  {profile.communityRoleType
                    ? (communityRoleLabels[profile.communityRoleType] ??
                      profile.communityRoleType)
                    : "미입력"}
                </DataRow>
              </dl>
            </section>

            <section className="mt-[36px] border-t border-sub-red pt-[24px]">
              <h2 className="text-h2-list text-background-600">회원 탈퇴</h2>
              <label
                htmlFor="withdraw-reason"
                className="mt-[16px] block text-h3-onboard text-background-500"
              >
                탈퇴 사유 (선택)
              </label>
              <textarea
                id="withdraw-reason"
                value={withdrawReason}
                maxLength={255}
                onChange={(event) => setWithdrawReason(event.target.value)}
                className="mt-[8px] h-[92px] w-full resize-none rounded-[6px] border border-background-300 px-[12px] py-[10px] text-h3-onboard outline-none focus:border-main-400"
              />
              <div className="mt-[6px] flex items-center justify-between">
                <span className="text-body-sub text-background-400">
                  {withdrawReason.length}/255
                </span>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="rounded-[6px] bg-sub-red px-[16px] py-[9px] text-h6 text-background-100"
                >
                  탈퇴하기
                </button>
              </div>
            </section>
          </>
        )}
      </div>

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-[20px] py-[40px]">
          <OnboardBoxFrame
            buttonCount={2}
            leftButtonText="취소"
            rightButtonText={isWithdrawing ? "처리 중..." : "탈퇴하기"}
            rightButtonColor="sub-red"
            leftButtonDisabled={isWithdrawing}
            rightButtonDisabled={isWithdrawing}
            onLeftButtonClick={() => setIsWithdrawModalOpen(false)}
            onRightButtonClick={handleWithdraw}
          >
            <div className="flex flex-col gap-[16px]">
              <h2 className="text-h1-onboard text-background-600">
                정말 회원 탈퇴하시겠어요?
              </h2>
              <p className="whitespace-pre-line text-h2-onboard text-background-500">
                탈퇴 후에는 계정과 저장된 정보를 복구할 수 없습니다.
              </p>
            </div>
          </OnboardBoxFrame>
        </div>
      )}
    </div>
  );
}
