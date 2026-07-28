import Logo from "@/assets/icons/Logo_kr.svg?react";

type AuthLoadingStateProps = {
  message: string;
  tone?: "default" | "inverse";
};

export default function AuthLoadingState({
  message,
  tone = "default",
}: AuthLoadingStateProps) {
  const isInverse = tone === "inverse";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] flex-col items-center justify-center gap-[24px]"
    >
      <Logo className="h-[35px] w-[90px]" aria-label="보듬" />
      <div
        aria-hidden="true"
        className={[
          "size-[32px] animate-spin rounded-full border-[3px]",
          isInverse
            ? "border-background-300 border-t-main-400"
            : "border-main-200 border-t-main-500",
        ].join(" ")}
      />
      <p
        className={[
          "text-center text-h2-onboard",
          isInverse ? "text-background-100" : "text-background-500",
        ].join(" ")}
      >
        {message}
      </p>
    </div>
  );
}
