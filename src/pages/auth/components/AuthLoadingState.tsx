import Logo from "@/assets/icons/Logo_kr.svg?react";

type AuthLoadingStateProps = {
  message: string;
};

export default function AuthLoadingState({ message }: AuthLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] flex-col items-center justify-center gap-[24px]"
    >
      <Logo className="h-[35px] w-[90px]" aria-label="보듬" />
      <div
        aria-hidden="true"
        className="size-[32px] animate-spin rounded-full border-[3px] border-main-200 border-t-main-500"
      />
      <p className="text-h2-onboard text-background-500">{message}</p>
    </div>
  );
}
