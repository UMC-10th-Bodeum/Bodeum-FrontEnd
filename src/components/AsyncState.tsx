interface AsyncStateProps {
  type: "loading" | "error";
  loadingText?: string;
  errorText?: string;
}

export default function AsyncState({
  type,
  loadingText = "로딩중...",
  errorText = "에러가 발생했습니다.",
}: AsyncStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <p className="text-h2-list text-background-400">
        {type === "loading" ? loadingText : errorText}
      </p>
    </div>
  );
}