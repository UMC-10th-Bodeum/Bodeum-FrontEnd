import Logo from "@/assets/icons/Logo_kr.svg?react";
import ButtonFill from "@/components/button/ButtonFill";

type AuthLoadErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function AuthLoadErrorState({
  message,
  onRetry,
}: AuthLoadErrorStateProps) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="flex w-full max-w-[536px] flex-col items-center rounded-[10px] bg-background-100 px-[32px] py-[40px] text-center shadow-[0_0_15px_rgb(0_0_0_/_0.12)] max-sm:px-[20px] max-sm:py-[32px]"
    >
      <Logo className="h-[35px] w-[90px]" aria-label="보듬" />
      <h1 className="mt-[28px] text-h1 text-background-600">
        진행 정보를 불러오지 못했습니다
      </h1>
      <p className="mt-[12px] break-words text-h3-onboard text-background-500">
        {message}
      </p>
      <p className="mt-[8px] text-body-sub text-background-400">
        저장된 로그인 및 온보딩 정보는 삭제되지 않습니다.
      </p>
      <ButtonFill
        label="다시 시도"
        onClick={onRetry}
        className="mt-[28px] h-[48px] w-full max-w-[260px]"
      />
    </section>
  );
}
