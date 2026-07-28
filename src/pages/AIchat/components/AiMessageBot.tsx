import AIMsgIcon from "@/assets/icons/AIMsg.svg?react";
import FeedbackButton from "@/components/FeedbackButton";

import AiMessageBubble, {
  type AiCurationResource,
  type AiMessageBubbleVariant,
} from "./AiMessageBubble";
import AiSuggestChip from "./AiSuggestChip";

type AiMessageBotProps = {
  variant?: Extract<AiMessageBubbleVariant, "ai" | "loading">;
  message?: string;
  resource?: AiCurationResource | null;
  suggestions?: string[];
  showFeedback?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  onBadFeedback?: () => void;
  className?: string;
};

export default function AiMessageBot({
  variant = "ai",
  message,
  resource,
  suggestions = [],
  showFeedback = variant === "ai",
  onSuggestionClick,
  onBadFeedback,
  className,
}: AiMessageBotProps) {
  return (
    <article
      className={`flex w-full flex-col items-start justify-center gap-[16px] py-[12px] ${className ?? ""}`}
    >
      <div className="flex w-full items-end gap-[10px]">
        <AIMsgIcon aria-hidden="true" className="size-[32px] shrink-0" />

        <div className="flex w-[708px] shrink-0 flex-col items-start">
          <AiMessageBubble
            variant={variant}
            message={message}
            resource={resource}
            className={variant === "ai" ? "w-full" : undefined}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="flex w-full flex-nowrap items-center gap-[10px] pl-[42px]">
          {suggestions.map((suggestion) => (
            <AiSuggestChip
              key={suggestion}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="px-[8px]! text-body-sub!"
            >
              {suggestion}
            </AiSuggestChip>
          ))}
        </div>
      )}

      {showFeedback && (
        <div className="flex h-[20px] w-[708px] items-center gap-[20px] px-[40px]">
          <FeedbackButton
            feedbackType="Good"
            label="도움이 됐어요"
            showCount={false}
          />
          <FeedbackButton
            feedbackType="Bad"
            label="정보가 틀려요"
            showCount={false}
            onClick={onBadFeedback}
          />
        </div>
      )}
    </article>
  );
}
