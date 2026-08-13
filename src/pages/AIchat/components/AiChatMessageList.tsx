import type { RefObject } from "react";

import type {
  AiFeedbackType,
  ChatMessage,
  HistorySection,
} from "@/types/aiChat";
import { shouldShowAiMessageFeedback } from "@/utils/aiChatMapper";
import AiMessageBot from "./AiMessageBot";
import AiMessageBubble from "./AiMessageBubble";
import DateDivider from "./DateDivider";

interface AiChatMessageListProps {
  effectiveAccessState: string;
  historySections: HistorySection[];
  hiddenTodayMessages: ChatMessage[];
  messages: ChatMessage[];
  isHistoryRevealed: boolean;
  todayDate: string;
  todayDateTime: string;
  feedbackByMessage: Record<number, AiFeedbackType>;
  latestHistorySectionRef: RefObject<HTMLDivElement | null>;
  latestHiddenTodayMessageRef: RefObject<HTMLDivElement | null>;
  onRetry: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onHelpfulFeedback: (messageId: number) => void;
  onIncorrectFeedback: (messageId: number) => void;
}

function UserMessageRow({ text }: { text: string }) {
  return (
    <article className="flex w-full flex-col items-end justify-center gap-[16px] py-[12px]">
      <AiMessageBubble variant="user" message={text} />
    </article>
  );
}

export default function AiChatMessageList({
  effectiveAccessState,
  historySections,
  hiddenTodayMessages,
  messages,
  isHistoryRevealed,
  todayDate,
  todayDateTime,
  feedbackByMessage,
  latestHistorySectionRef,
  latestHiddenTodayMessageRef,
  onRetry,
  onSuggestionClick,
  onHelpfulFeedback,
  onIncorrectFeedback,
}: AiChatMessageListProps) {
  const renderMessage = (message: ChatMessage) => {
    if (message.role === "user") {
      return <UserMessageRow key={message.id} text={message.text} />;
    }

    if (message.role === "loading") {
      return <AiMessageBot key={message.id} variant="loading" />;
    }

    const serverId = message.serverId;
    const hasServerId = serverId !== undefined;
    const selectedFeedback = hasServerId
      ? feedbackByMessage[serverId] === "HELPFUL"
        ? "helpful"
        : feedbackByMessage[serverId] === "INCORRECT"
          ? "incorrect"
          : null
      : null;

    return (
      <AiMessageBot
        key={message.id}
        message={message.text}
        resources={message.resources}
        warning={message.warning}
        suggestions={message.suggestions}
        showFeedback={shouldShowAiMessageFeedback(message)}
        selectedFeedback={selectedFeedback}
        onSuggestionClick={onSuggestionClick}
        onGoodFeedback={
          hasServerId ? () => onHelpfulFeedback(serverId) : undefined
        }
        onBadFeedback={
          hasServerId ? () => onIncorrectFeedback(serverId) : undefined
        }
      />
    );
  };

  return (
    <>
      {effectiveAccessState === "error" && (
        <div
          role="alert"
          className="flex h-full min-h-full w-full flex-1 flex-col items-center justify-center gap-[12px] text-center"
        >
          <p className="text-h3-onboard text-background-600">
            대화를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-[10px] bg-main-400 px-[16px] py-[8px] text-h4-list text-background-100 transition-colors hover:bg-main-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
          >
            다시 시도
          </button>
        </div>
      )}

      {isHistoryRevealed &&
        historySections.map((section, index) => (
          <div
            key={section.dateTime}
            ref={
              index === historySections.length - 1
                ? latestHistorySectionRef
                : undefined
            }
            className="w-full"
          >
            <DateDivider date={section.date} dateTime={section.dateTime} />
            {section.messages.map(renderMessage)}
          </div>
        ))}

      <div className="w-full">
        {isHistoryRevealed && (
          <DateDivider date={todayDate} dateTime={todayDateTime} />
        )}

        {isHistoryRevealed &&
          hiddenTodayMessages.map((message, index) => (
            <div
              key={message.id}
              ref={
                index === hiddenTodayMessages.length - 1
                  ? latestHiddenTodayMessageRef
                  : undefined
              }
            >
              {renderMessage(message)}
            </div>
          ))}

        {messages.map(renderMessage)}
      </div>
    </>
  );
}
