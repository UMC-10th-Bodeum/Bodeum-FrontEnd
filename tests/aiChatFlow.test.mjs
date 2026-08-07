import assert from "node:assert/strict";
import test from "node:test";

import {
  partitionMessagesByLoginSession,
  resolveAiChatRoom,
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

function createApiError(status, code) {
  return { response: { status, data: { code } } };
}

test("채팅방 조회에 성공하면 생성 요청 없이 조회 결과를 사용한다", async () => {
  const room = { aiChatRoomId: 1 };
  let createCount = 0;

  const result = await resolveAiChatRoom(
    async () => room,
    async () => {
      createCount += 1;
      return { aiChatRoomId: 2 };
    },
  );

  assert.equal(result, room);
  assert.equal(createCount, 0);
});

test("AI404_1이면 채팅방을 생성하고 생성 응답을 사용한다", async () => {
  const createdRoom = { aiChatRoomId: 2 };
  let getCount = 0;

  const result = await resolveAiChatRoom(
    async () => {
      getCount += 1;
      throw createApiError(404, "AI404_1");
    },
    async () => createdRoom,
  );

  assert.equal(result, createdRoom);
  assert.equal(getCount, 1);
});

test("채팅방 생성이 AI409_1이면 한 번 더 조회한다", async () => {
  const existingRoom = { aiChatRoomId: 3 };
  let getCount = 0;

  const result = await resolveAiChatRoom(
    async () => {
      getCount += 1;
      if (getCount === 1) throw createApiError(404, "AI404_1");
      return existingRoom;
    },
    async () => {
      throw createApiError(409, "AI409_1");
    },
  );

  assert.equal(result, existingRoom);
  assert.equal(getCount, 2);
});

test("AI404_1이 아닌 조회 오류에는 채팅방을 생성하지 않는다", async () => {
  const getError = createApiError(500, "AI500_1");
  let createCount = 0;

  await assert.rejects(
    resolveAiChatRoom(
      async () => {
        throw getError;
      },
      async () => {
        createCount += 1;
        return { aiChatRoomId: 2 };
      },
    ),
    (error) => error === getError,
  );
  assert.equal(createCount, 0);
});

test("AI409_1이 아닌 생성 오류는 그대로 전달한다", async () => {
  const createError = createApiError(500, "AI500_2");
  let getCount = 0;

  await assert.rejects(
    resolveAiChatRoom(
      async () => {
        getCount += 1;
        throw createApiError(404, "AI404_1");
      },
      async () => {
        throw createError;
      },
    ),
    (error) => error === createError,
  );
  assert.equal(getCount, 1);
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
