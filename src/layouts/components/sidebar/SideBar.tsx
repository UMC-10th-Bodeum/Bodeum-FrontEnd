import ExportIcon from "@/assets/icons/Export.svg?react";
import Logo from "@/assets/icons/Logo_kr.svg?react";
import {
  AUTH_STATE_CHANGED_EVENT,
  logoutCurrentUser,
} from "@/apis/authApi";
import { getApiErrorMessage } from "@/apis/apiError";
import {
  getUserBrief,
  USER_PROFILE_CHANGED_EVENT,
} from "@/apis/userApi";
import type { UserBrief } from "@/types/user";
import { showToast } from "@/components/Toast";
import { legalLinks } from "@/constants/legalLinks";
import { clearAuthProgress } from "@/pages/auth/authProgressStorage";
import { clearAgreementBrowserSession } from "@/pages/auth/agreementBrowserSession";
import { clearOnboardingBrowserSession } from "@/pages/auth/onboardingBrowserSession";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import UserSection from "./UserSection";

export default function SideBar() {
  const navigate = useNavigate();
  const [brief, setBrief] = useState<UserBrief | null>(null);
  const logoutInFlight = useRef(false);
  const briefRequestSequence = useRef(0);

  const loadBrief = useCallback(async () => {
    const requestSequence = ++briefRequestSequence.current;

    try {
      const nextBrief = await getUserBrief();

      if (requestSequence !== briefRequestSequence.current) {
        return;
      }

      setBrief(nextBrief);
    } catch (error) {
      if (requestSequence !== briefRequestSequence.current) {
        return;
      }

      console.error("사이드바 사용자 정보를 불러오지 못했습니다.", error);
      setBrief({
        isLoggedIn: false,
        onboardingCompleted: false,
        nickname: null,
        profileImageUrl: null,
        level: null,
        badgeName: null,
        childDisabilityTypes: [],
        childAge: null,
        region: null,
      });
    }
  }, []);

  useEffect(() => {
    void loadBrief();
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, loadBrief);
    window.addEventListener(USER_PROFILE_CHANGED_EVENT, loadBrief);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, loadBrief);
      window.removeEventListener(USER_PROFILE_CHANGED_EVENT, loadBrief);
      briefRequestSequence.current += 1;
    };
  }, [loadBrief]);

  const handleLogout = async () => {
    if (logoutInFlight.current) {
      return;
    }

    logoutInFlight.current = true;

    try {
      await logoutCurrentUser();
      showToast("green", "로그아웃되었습니다.");
    } catch (error) {
      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "서버 로그아웃에는 실패했지만 이 기기에서는 로그아웃되었습니다.",
        ),
      );
    } finally {
      clearAuthProgress();
      clearAgreementBrowserSession();
      clearOnboardingBrowserSession();
      logoutInFlight.current = false;
      navigate("/");
    }
  };

  const isLoggedIn = brief?.isLoggedIn === true;
  const userSectionType = !isLoggedIn
    ? "guest"
    : brief.onboardingCompleted
      ? "parent"
      : "empty";
  const disability = brief?.childDisabilityTypes
    ?.filter(Boolean)
    .map(({ label }) => label)
    .join(" · ");

  return (
    <aside className="flex h-screen flex-col bg-white w-[213px]">
      <div className="h-[60px] py-[18px] flex items-center justify-center border-b border-background-250">
        <Logo className="w-[62px] h-[24px]" />
      </div>

      <div className="flex flex-1 flex-col border-r border-background-250">
        <div className="px-4 pt-[20px]">
          {brief === null ? (
            <div className="h-[142px] w-[181px] animate-pulse rounded-[8px] border border-background-250 bg-background-150" />
          ) : (
            <UserSection
              type={userSectionType}
              name={brief.nickname ?? undefined}
              disability={disability || undefined}
              level={brief.level ?? undefined}
              age={brief.childAge ?? undefined}
              profileImageUrl={brief.profileImageUrl}
              onButtonClick={() => {
                if (!isLoggedIn) {
                  navigate("/auth");
                  return;
                }

                if (!brief.onboardingCompleted) {
                  navigate("/auth?flow=onboarding&source=profile");
                  return;
                }

                navigate("/mypage");
              }}
            />
          )}

          <div className="mt-[18px]">
            <SideNav />
          </div>
        </div>

        <div className="mt-auto border-t border-background-250 px-[16px]">
          <div className="mb-[16px] pt-[12px] flex text-body-sub text-background-500">
            <a
              href={legalLinks.privacyPolicy}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              개인정보처리방침
            </a>

            <span className="mx-[4px]">|</span>

            <button
              type="button"
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  "https://app.notion.com/p/3ac34bae492a80ee99e3c6c69b794801",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              공공 데이터
            </button>
          </div>

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 pb-[23px] text-h6 text-background-500 cursor-pointer"
            >
              <ExportIcon />
              로그아웃
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
