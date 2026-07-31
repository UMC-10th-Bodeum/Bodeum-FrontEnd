export type AiChatEntryModal =
  | "login-required"
  | "consent-required"
  | "guide"
  | null;

type AiChatAccessState =
  | "loading"
  | "login-required"
  | "consent-required"
  | "ready"
  | "error";

export function resolveAiChatEntryModal(
  accessState: AiChatAccessState,
  showGuideModal: boolean,
): AiChatEntryModal {
  if (accessState === "login-required") return "login-required";
  if (accessState === "consent-required") return "consent-required";
  if (accessState === "ready" && showGuideModal) return "guide";
  return null;
}

type TimestampedMessage = {
  createdAt: string;
};

export function partitionMessagesByLoginSession<T extends TimestampedMessage>(
  messages: T[],
  sessionStartedAt: string,
) {
  const sessionStartedTimestamp = new Date(sessionStartedAt).getTime();

  return messages.reduce<{
    beforeLogin: T[];
    currentSession: T[];
  }>(
    (partitioned, message) => {
      const messageTimestamp = new Date(message.createdAt).getTime();
      const isCurrentSessionMessage =
        Number.isFinite(sessionStartedTimestamp) &&
        Number.isFinite(messageTimestamp) &&
        messageTimestamp >= sessionStartedTimestamp;

      partitioned[
        isCurrentSessionMessage ? "currentSession" : "beforeLogin"
      ].push(message);
      return partitioned;
    },
    { beforeLogin: [], currentSession: [] },
  );
}

type ShouldShowPreviousHistoryButtonOptions = {
  accessReady: boolean;
  historyRevealed: boolean;
  historyLoading: boolean;
  hasPreviousMessages: boolean;
  hasHiddenTodayMessages: boolean;
};

export function shouldShowPreviousHistoryButton({
  accessReady,
  historyRevealed,
  historyLoading,
  hasPreviousMessages,
  hasHiddenTodayMessages,
}: ShouldShowPreviousHistoryButtonOptions) {
  return (
    accessReady &&
    !historyRevealed &&
    !historyLoading &&
    (hasPreviousMessages || hasHiddenTodayMessages)
  );
}
