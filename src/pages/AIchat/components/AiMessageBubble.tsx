import AiLoading from "@/assets/icons/AILoading.png";

export type AiMessageBubbleVariant = "ai" | "user" | "loading";

export type AiCurationResource = {
  title: string;
  url?: string;
};

type AiMessageBubbleProps = {
  variant?: AiMessageBubbleVariant;
  message?: string;
  resource?: AiCurationResource | null;
  resources?: AiCurationResource[];
  warning?: string | null;
  className?: string;
};

export default function AiMessageBubble({
  variant = "ai",
  message,
  resource,
  resources,
  warning,
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

  const visibleResources = resources ?? (resource ? [resource] : []);

  return (
    <div
      className={`flex w-full max-w-[800px] flex-col items-start gap-[20px] rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] border border-main-100 bg-background-100 px-[20px] py-[12px] ${className ?? ""}`}
    >
      <p className="w-full whitespace-pre-wrap break-words text-h3-onboard text-background-600">
        {message}
      </p>

      {warning && (
        <p
          role="note"
          className="w-full rounded-[10px] bg-sub-yellow-2 px-[16px] py-[10px] text-body-sub text-background-600"
        >
          {warning}
        </p>
      )}

      {visibleResources.length > 0 && (
        <div className="flex w-full flex-col gap-[10px]">
          {visibleResources.map((visibleResource, index) => (
            <a
              key={`${visibleResource.title}-${visibleResource.url ?? ""}-${index}`}
              href={visibleResource.url || undefined}
              target={visibleResource.url ? "_blank" : undefined}
              rel={visibleResource.url ? "noreferrer" : undefined}
              aria-disabled={!visibleResource.url}
              className={`flex w-full flex-col items-start gap-[6px] rounded-[10px] border border-main-100 bg-main-100 px-[16px] py-[10px] text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
                visibleResource.url
                  ? "cursor-pointer hover:bg-main-150"
                  : "cursor-default"
              }`}
            >
              <span className="w-full text-h6 text-background-600">
                📌 {visibleResource.title} &gt;
              </span>
            </a>
          ))}
          <p className="w-full text-body-sub text-background-400">
            해당 출처는 믿을 수 있는 공공기관 및 전문 사이트의 정보를 바탕으로
            제공됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
