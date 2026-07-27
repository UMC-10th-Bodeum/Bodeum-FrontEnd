import AiLoading from "@/assets/icons/AILoading.png";

export type AiMessageBubbleVariant = "ai" | "user" | "loading";

export type AiCurationResource = {
  title: string;
  meta: string;
};

type AiMessageBubbleProps = {
  variant?: AiMessageBubbleVariant;
  message?: string;
  resource?: AiCurationResource | null;
  className?: string;
};

const defaultAiMessage = `안녕하세요! 저는 보듬 AI 큐레이션 입니다 😊

OO님의 정보를 바탕으로
복지 바우처, 재활 기관, 지원 제도 등 발달장애 아동 양육에 필요한 정보를 쉽고 빠르게 안내해드려요.

무엇이 궁금하신가요?`;

export default function AiMessageBubble({
  variant = "ai",
  message,
  resource,
  className,
}: AiMessageBubbleProps) {
  if (variant === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex h-[231px] w-[708px] flex-col items-center justify-center rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] border border-main-100 bg-background-100 py-[12px] ${className ?? ""}`}
      >
        <div className="flex shrink-0 flex-col items-center gap-[12px] py-[10px]">
          <div className="relative size-[100px] shrink-0" aria-hidden="true">
            <img
              src={AiLoading}
              alt=""
              className="absolute inset-0 size-full max-w-none animate-spin"
            />
            <span className="absolute left-1/2 top-1/2 size-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background-100" />
            <img
              src={AiLoading}
              alt=""
              className="absolute inset-0 size-full max-w-none [clip-path:circle(26px_at_50%_50%)]"
            />
          </div>
          <p className="whitespace-nowrap text-center text-h3-onboard text-background-500">
            정보를 꼼꼼하게 찾고 있어요
            <br />
            잠시만 기다려주세요
          </p>
        </div>
      </div>
    );
  }

  if (variant === "user") {
    return (
      <div
        className={`flex max-w-[800px] flex-col items-start rounded-bl-[10px] rounded-br-[10px] rounded-tl-[10px] border border-main-400 bg-main-200 px-[20px] py-[12px] ${className ?? ""}`}
      >
        <p className="w-full whitespace-pre-wrap break-words text-h3-onboard text-background-600">
          {message}
        </p>
      </div>
    );
  }

  const visibleResource = resource;

  return (
    <div
      className={`flex w-full max-w-[800px] flex-col items-start gap-[20px] rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] border border-main-100 bg-background-100 px-[20px] py-[12px] ${className ?? ""}`}
    >
      <p className="w-full whitespace-pre-wrap break-words text-h3-onboard text-background-600">
        {message ?? defaultAiMessage}
      </p>

      {visibleResource && (
        <button
          type="button"
          className="flex w-full cursor-pointer flex-col items-start gap-[6px] rounded-[10px] border border-main-100 bg-main-100 px-[16px] py-[10px] text-left transition-colors hover:bg-main-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
        >
          <span className="w-full text-h6 text-background-600">
            {visibleResource.title}
          </span>
          <span className="w-full text-body-sub text-background-500">
            {visibleResource.meta}
          </span>
        </button>
      )}
    </div>
  );
}
