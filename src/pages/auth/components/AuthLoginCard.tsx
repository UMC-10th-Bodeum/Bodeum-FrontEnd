import Logo from "@/assets/icons/Logo_kr.svg?react";
import KakaoIcon from "@/assets/icons/KakaoIcon.svg?react";
import NaverIcon from "@/assets/icons/NaverIcon.svg?react";
import type { SocialProvider } from "@/apis/authApi";

type AuthLoginCardProps = {
  onAuthenticate: (provider: SocialProvider) => void;
  isRedirecting?: boolean;
};

type SocialLoginButtonProps = {
  provider: SocialProvider;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function SocialLoginButton({
  provider,
  label,
  onClick,
  disabled = false,
}: SocialLoginButtonProps) {
  const isNaver = provider === "naver";
  const icon = isNaver ? (
    <NaverIcon className="size-[18px] text-background-100" aria-hidden="true" />
  ) : (
    <KakaoIcon className="h-[19px] w-[20px] text-[#000000]" aria-hidden="true" />
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: isNaver ? "#03A94D" : "#FEE500" }}
      className={[
        "flex h-[48px] w-[536px] max-w-full cursor-pointer items-center justify-center rounded-[10px] px-[24px] py-[12px]",
        "text-h3-category focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isNaver ? "text-background-100" : "text-background-600",
      ].join(" ")}
    >
      <span className="flex h-[24px] shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="flex w-[419px] min-w-0 items-center justify-center px-[8px]">
        {label}
      </span>
    </button>
  );
}

export default function AuthLoginCard({
  onAuthenticate,
  isRedirecting = false,
}: AuthLoginCardProps) {
  return (
    <div className="flex w-full max-w-[624px] flex-col items-center justify-center gap-[40px]">
      <section className="flex w-full flex-col items-start rounded-[20px] bg-background-100 p-[44px] shadow-[0_0_15px_rgb(102_128_155_/_0.1)] max-sm:p-[24px]">
        <div className="flex w-[548px] max-w-full flex-col gap-[48px]">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-center gap-[4px]">
              <div className="flex w-full items-center justify-center py-[10px]">
                <Logo className="h-[35px] w-[90px]" aria-label="보듬" />
              </div>
              <p className="w-full text-center text-h1 text-background-600">
                장애아동을 위한 복지 큐레이션 서비스
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[16px]">
            <SocialLoginButton
              provider="naver"
              label="네이버 로그인"
              onClick={() => onAuthenticate("naver")}
              disabled={isRedirecting}
            />
            <SocialLoginButton
              provider="kakao"
              label="카카오 로그인"
              onClick={() => onAuthenticate("kakao")}
              disabled={isRedirecting}
            />
          </div>
        </div>
      </section>

      <div className="flex w-full items-center justify-center gap-[20px] text-h3-onboard text-background-500">
        <button type="button" className="cursor-pointer underline">
          이용약관
        </button>
        <button type="button" className="cursor-pointer font-medium underline">
          개인정보처리방침
        </button>
      </div>
    </div>
  );
}
