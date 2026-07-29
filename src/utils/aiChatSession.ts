const AI_CHAT_HISTORY_REVEALED_KEY = "bodeum:ai-chat:history-revealed";
const AI_CHAT_SESSION_STARTED_KEY = "bodeum:ai-chat:session-started";

export function hasStartedAiChatSession() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem(AI_CHAT_SESSION_STARTED_KEY) === "true";
}

export function markAiChatSessionAsStarted() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AI_CHAT_SESSION_STARTED_KEY, "true");
}

export function hasRevealedAiChatHistory() {
  if (typeof window === "undefined") return false;

  return (
    window.localStorage.getItem(AI_CHAT_HISTORY_REVEALED_KEY) === "true"
  );
}

export function markAiChatHistoryAsRevealed() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AI_CHAT_HISTORY_REVEALED_KEY, "true");
}

export function resetAiChatSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AI_CHAT_HISTORY_REVEALED_KEY);
  window.localStorage.removeItem(AI_CHAT_SESSION_STARTED_KEY);
}
