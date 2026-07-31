const AI_CHAT_LOGIN_SESSION_KEY = "bodeum:ai-chat:login-session";
const LEGACY_AI_CHAT_HISTORY_REVEALED_KEY =
  "bodeum:ai-chat:history-revealed";
const LEGACY_AI_CHAT_SESSION_STARTED_KEY =
  "bodeum:ai-chat:session-started";

export type AiChatSessionStarter = {
  greeting: string;
  suggestedQuestions: string[];
};

type AiChatLoginSession = {
  userId: number;
  sessionStartedAt: string;
  hasEnteredAiChat: boolean;
  historyRevealed: boolean;
  starter: AiChatSessionStarter | null;
};

function isAiChatLoginSession(value: unknown): value is AiChatLoginSession {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<AiChatLoginSession>;
  return (
    typeof session.userId === "number" &&
    typeof session.sessionStartedAt === "string" &&
    Number.isFinite(new Date(session.sessionStartedAt).getTime()) &&
    typeof session.hasEnteredAiChat === "boolean" &&
    typeof session.historyRevealed === "boolean" &&
    (session.starter === null ||
      (typeof session.starter === "object" &&
        typeof session.starter.greeting === "string" &&
        Array.isArray(session.starter.suggestedQuestions)))
  );
}

function readAiChatLoginSession() {
  if (typeof window === "undefined") return null;

  const serializedSession = window.localStorage.getItem(
    AI_CHAT_LOGIN_SESSION_KEY,
  );
  if (!serializedSession) return null;

  try {
    const session: unknown = JSON.parse(serializedSession);
    return isAiChatLoginSession(session) ? session : null;
  } catch {
    return null;
  }
}

function writeAiChatLoginSession(session: AiChatLoginSession) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    AI_CHAT_LOGIN_SESSION_KEY,
    JSON.stringify(session),
  );
}

function clearLegacyAiChatSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(LEGACY_AI_CHAT_HISTORY_REVEALED_KEY);
  window.localStorage.removeItem(LEGACY_AI_CHAT_SESSION_STARTED_KEY);
}

function migrateLegacyAiChatSession(userId: number | null) {
  if (
    typeof window === "undefined" ||
    window.localStorage.getItem(LEGACY_AI_CHAT_SESSION_STARTED_KEY) !== "true"
  ) {
    return null;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const migratedSession: AiChatLoginSession = {
    userId: userId ?? 0,
    sessionStartedAt: startOfToday.toISOString(),
    hasEnteredAiChat: true,
    historyRevealed:
      window.localStorage.getItem(LEGACY_AI_CHAT_HISTORY_REVEALED_KEY) ===
      "true",
    starter: null,
  };

  writeAiChatLoginSession(migratedSession);
  clearLegacyAiChatSession();
  return migratedSession;
}

function getTokenIssuedAt(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const [, encodedPayload] = accessToken.split(".");
    if (!encodedPayload) return null;

    const base64 = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload: unknown = JSON.parse(window.atob(base64));
    const issuedAt =
      payload && typeof payload === "object"
        ? (payload as { iat?: unknown }).iat
        : undefined;

    return typeof issuedAt === "number"
      ? new Date(issuedAt * 1_000).toISOString()
      : null;
  } catch {
    return null;
  }
}

export function startAiChatLoginSession(
  userId: number,
  accessToken: string | null,
) {
  const session: AiChatLoginSession = {
    userId,
    sessionStartedAt:
      getTokenIssuedAt(accessToken) ?? new Date().toISOString(),
    hasEnteredAiChat: false,
    historyRevealed: false,
    starter: null,
  };

  writeAiChatLoginSession(session);
  clearLegacyAiChatSession();

  return session;
}

export function ensureAiChatLoginSession(
  userId: number | null,
  accessToken: string | null,
) {
  const currentSession = readAiChatLoginSession();
  if (
    currentSession &&
    (userId === null || currentSession.userId === userId)
  ) {
    return currentSession;
  }

  const migratedSession = migrateLegacyAiChatSession(userId);
  if (migratedSession) return migratedSession;

  return startAiChatLoginSession(userId ?? 0, accessToken);
}

export function getAiChatSessionStartedAt() {
  return readAiChatLoginSession()?.sessionStartedAt ?? null;
}

export function getAiChatSessionStarter() {
  return readAiChatLoginSession()?.starter ?? null;
}

export function storeAiChatSessionStarter(starter: AiChatSessionStarter) {
  const currentSession = readAiChatLoginSession();
  if (!currentSession) return;

  writeAiChatLoginSession({ ...currentSession, starter });
}

export function hasStartedAiChatSession() {
  return readAiChatLoginSession()?.hasEnteredAiChat ?? false;
}

export function markAiChatSessionAsStarted() {
  const currentSession = readAiChatLoginSession();
  if (!currentSession) return;

  writeAiChatLoginSession({ ...currentSession, hasEnteredAiChat: true });
}

export function hasRevealedAiChatHistory() {
  return readAiChatLoginSession()?.historyRevealed ?? false;
}

export function markAiChatHistoryAsRevealed() {
  const currentSession = readAiChatLoginSession();
  if (!currentSession) return;

  writeAiChatLoginSession({ ...currentSession, historyRevealed: true });
}

export function resetAiChatSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AI_CHAT_LOGIN_SESSION_KEY);
  window.localStorage.removeItem(LEGACY_AI_CHAT_HISTORY_REVEALED_KEY);
  window.localStorage.removeItem(LEGACY_AI_CHAT_SESSION_STARTED_KEY);
}
