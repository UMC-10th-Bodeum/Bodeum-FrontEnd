export type AiChatEntryContent = "starter" | "today-messages";
export type AiChatHistoryTarget = "past" | "today";
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

type ResolveAiChatEntryFlowOptions = {
  hasTodayMessages: boolean;
  loginSessionStarted: boolean;
  historyRevealed: boolean;
};

export type AiChatEntryFlow = {
  entryContent: AiChatEntryContent;
  keepTodayMessagesHidden: boolean;
  historyTarget: AiChatHistoryTarget;
};

export function resolveAiChatEntryFlow({
  hasTodayMessages,
  loginSessionStarted,
  historyRevealed,
}: ResolveAiChatEntryFlowOptions): AiChatEntryFlow {
  const showTodayMessages =
    hasTodayMessages && (loginSessionStarted || historyRevealed);
  const keepTodayMessagesHidden = hasTodayMessages && !showTodayMessages;

  return {
    entryContent: showTodayMessages ? "today-messages" : "starter",
    keepTodayMessagesHidden,
    historyTarget: keepTodayMessagesHidden ? "today" : "past",
  };
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
