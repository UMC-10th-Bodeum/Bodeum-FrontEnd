import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveAiChatEntryModal,
  resolveAiChatEntryFlow,
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

test("오늘 대화가 없으면 첫 발화로 입장하고 기록 버튼은 어제를 향한다", () => {
  assert.deepEqual(
    resolveAiChatEntryFlow({
      hasTodayMessages: false,
      loginSessionStarted: true,
      historyRevealed: false,
    }),
    {
      entryContent: "starter",
      keepTodayMessagesHidden: false,
      historyTarget: "past",
    },
  );
});

test("로그아웃하지 않은 세션에 오늘 대화가 있으면 오늘 대화를 표시한다", () => {
  assert.deepEqual(
    resolveAiChatEntryFlow({
      hasTodayMessages: true,
      loginSessionStarted: true,
      historyRevealed: false,
    }),
    {
      entryContent: "today-messages",
      keepTodayMessagesHidden: false,
      historyTarget: "past",
    },
  );
});

test("재로그인 후에는 오늘 대화도 숨기고 첫 발화로 입장한다", () => {
  assert.deepEqual(
    resolveAiChatEntryFlow({
      hasTodayMessages: true,
      loginSessionStarted: false,
      historyRevealed: false,
    }),
    {
      entryContent: "starter",
      keepTodayMessagesHidden: true,
      historyTarget: "today",
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
