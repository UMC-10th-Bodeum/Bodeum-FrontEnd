import assert from "node:assert/strict";
import test from "node:test";

import {
  partitionMessagesByLoginSession,
  resolveAiChatEntryModal,
  shouldShowPreviousHistoryButton,
} from "../src/pages/AIchat/aiChatFlow.ts";

test("비로그인 상태에서는 다른 조건보다 로그인 유도 모달을 우선한다", () => {
  assert.equal(resolveAiChatEntryModal("login-required", true), "login-required");
  assert.equal(
    resolveAiChatEntryModal("consent-required", true),
    "consent-required",
  );
  assert.equal(resolveAiChatEntryModal("ready", true), "guide");
  assert.equal(resolveAiChatEntryModal("ready", false), null);
});

test("오늘 대화를 로그인 시각 전후로 나눈다", () => {
  const messages = [
    { id: 1, createdAt: "2026-07-31T09:59:59+09:00" },
    { id: 2, createdAt: "2026-07-31T10:00:00+09:00" },
    { id: 3, createdAt: "2026-07-31T10:05:00+09:00" },
  ];

  assert.deepEqual(
    partitionMessagesByLoginSession(
      messages,
      "2026-07-31T10:00:00+09:00",
    ),
    {
      beforeLogin: [messages[0]],
      currentSession: [messages[1], messages[2]],
    },
  );
});

test("잘못된 시각의 메시지는 현재 세션에 노출하지 않는다", () => {
  const invalidMessage = { id: 1, createdAt: "invalid" };

  assert.deepEqual(
    partitionMessagesByLoginSession(
      [invalidMessage],
      "2026-07-31T10:00:00+09:00",
    ),
    {
      beforeLogin: [invalidMessage],
      currentSession: [],
    },
  );
});

test("기록 버튼은 한 번 연 뒤 로그아웃으로 상태가 초기화되기 전까지 숨긴다", () => {
  const common = {
    accessReady: true,
    historyLoading: false,
    hasPreviousMessages: true,
    hasHiddenTodayMessages: false,
  };

  assert.equal(
    shouldShowPreviousHistoryButton({
      ...common,
      historyRevealed: false,
    }),
    true,
  );
  assert.equal(
    shouldShowPreviousHistoryButton({
      ...common,
      historyRevealed: true,
    }),
    false,
  );
});
