import assert from "node:assert/strict";
import test from "node:test";

import {
  ensureAiChatLoginSession,
  getAiChatSessionStarter,
  getAiChatSessionStartedAt,
  hasRevealedAiChatHistory,
  hasStartedAiChatSession,
  markAiChatHistoryAsRevealed,
  markAiChatSessionAsStarted,
  resetAiChatSession,
  startAiChatLoginSession,
  storeAiChatSessionStarter,
} from "../src/utils/aiChatSession.ts";

class MemoryStorage {
  #items = new Map();

  getItem(key) {
    return this.#items.get(key) ?? null;
  }

  setItem(key, value) {
    this.#items.set(key, String(value));
  }

  removeItem(key) {
    this.#items.delete(key);
  }
}

const localStorage = new MemoryStorage();
globalThis.window = {
  localStorage,
  atob: (value) => Buffer.from(value, "base64").toString("binary"),
};

function createAccessToken(issuedAt) {
  const payload = Buffer.from(JSON.stringify({ iat: issuedAt }))
    .toString("base64url");
  return `header.${payload}.signature`;
}

test.beforeEach(() => {
  resetAiChatSession();
});

test("로그인 토큰 발급 시각으로 새 AI 채팅 세션을 시작한다", () => {
  startAiChatLoginSession(7, createAccessToken(1_800_000_000));

  assert.equal(
    getAiChatSessionStartedAt(),
    new Date(1_800_000_000 * 1_000).toISOString(),
  );
  assert.equal(hasStartedAiChatSession(), false);
  assert.equal(hasRevealedAiChatHistory(), false);
});

test("같은 사용자의 토큰 재발급은 로그인 세션 상태를 유지한다", () => {
  startAiChatLoginSession(7, createAccessToken(1_800_000_000));
  markAiChatSessionAsStarted();
  markAiChatHistoryAsRevealed();
  storeAiChatSessionStarter({
    greeting: "안녕하세요",
    suggestedQuestions: ["질문"],
  });

  ensureAiChatLoginSession(7, createAccessToken(1_800_003_600));

  assert.equal(
    getAiChatSessionStartedAt(),
    new Date(1_800_000_000 * 1_000).toISOString(),
  );
  assert.equal(hasStartedAiChatSession(), true);
  assert.equal(hasRevealedAiChatHistory(), true);
  assert.deepEqual(getAiChatSessionStarter(), {
    greeting: "안녕하세요",
    suggestedQuestions: ["질문"],
  });
});

test("다른 사용자가 로그인하면 AI 채팅 세션 상태를 초기화한다", () => {
  startAiChatLoginSession(7, createAccessToken(1_800_000_000));
  markAiChatSessionAsStarted();
  markAiChatHistoryAsRevealed();

  ensureAiChatLoginSession(8, createAccessToken(1_800_003_600));

  assert.equal(hasStartedAiChatSession(), false);
  assert.equal(hasRevealedAiChatHistory(), false);
  assert.equal(getAiChatSessionStarter(), null);
});

test("기존 AI 채팅 세션 상태를 새 저장 형식으로 이관한다", () => {
  localStorage.setItem("bodeum:ai-chat:session-started", "true");
  localStorage.setItem("bodeum:ai-chat:history-revealed", "true");

  ensureAiChatLoginSession(null, createAccessToken(1_800_003_600));

  assert.equal(hasStartedAiChatSession(), true);
  assert.equal(hasRevealedAiChatHistory(), true);
  assert.equal(
    localStorage.getItem("bodeum:ai-chat:session-started"),
    null,
  );
  assert.equal(
    localStorage.getItem("bodeum:ai-chat:history-revealed"),
    null,
  );
});
