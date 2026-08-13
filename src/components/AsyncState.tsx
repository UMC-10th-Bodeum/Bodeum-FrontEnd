interface AsyncStateProps {
  type: "loading" | "error";
  variant?: "page" | "section";
  loadingText?: string;
  errorText?: string;
  className?: string;
  textClassName?: string;
}

export default function AsyncState({
  type,
  variant = "page",
  loadingText = "로딩중...",
  errorText = "오류가 발생했습니다.",
  className = "",
  textClassName = "text-h2-list text-background-400",
}: AsyncStateProps) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`flex items-center justify-center ${
        variant === "page" ? "min-h-[calc(100vh-80px)]" : ""
      } ${className}`}
    >
      <p className={textClassName}>
        {isError ? errorText : loadingText}
      </p>
    </div>
  );
}
