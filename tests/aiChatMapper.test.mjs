import assert from "node:assert/strict";
import test from "node:test";

import {
  collectFeedbackByMessage,
  deduplicateMessages,
  mapApiMessage,
  mapCurrentSessionMessages,
} from "../src/utils/aiChatMapper.ts";

function createMessage(overrides = {}) {
  return {
    aiMessageId: 1,
    senderType: "AI",
    answerStatus: "ANSWERED",
    content: "답변",
    createdAt: "2026-08-05T10:00:00+09:00",
    sources: [],
    feedback: null,
    warning: null,
    ...overrides,
  };
}

test("API 메시지를 기존 화면 메시지 형식으로 변환한다", () => {
  assert.deepEqual(
    mapApiMessage(
      createMessage({
        sources: [
          {
            sourceType: "INFO",
            sourceId: 3,
            sourceTitle: "지원 정보",
            sourceUrl: "https://example.com/info",
            updatedAt: null,
          },
        ],
        warning: { type: "INCORRECT_SOURCE", message: "출처 확인 필요" },
      }),
    ),
    {
      id: 1,
      serverId: 1,
      role: "bot",
      text: "답변",
      resources: [
        { title: "지원 정보", url: "https://example.com/info" },
      ],
      warning: "출처 확인 필요",
      suggestions: undefined,
    },
  );
});

test("서버 인사말이 없을 때만 로컬 starter를 앞에 추가한다", () => {
  const starter = { greeting: "안녕하세요", suggestedQuestions: ["질문"] };
  const answered = createMessage();
  const withStarter = mapCurrentSessionMessages([answered], starter);

  assert.equal(withStarter[0].id, 0);
  assert.equal(withStarter[0].text, "안녕하세요");

  const greeting = createMessage({
    aiMessageId: 2,
    answerStatus: "GREETING",
    content: "서버 인사말",
  });
  const persisted = mapCurrentSessionMessages([greeting, answered], starter);

  assert.equal(persisted.length, 2);
  assert.deepEqual(persisted[0].suggestions, ["질문"]);
});

test("메시지 중복 제거·시간 정렬·피드백 수집 규칙을 유지한다", () => {
  const later = createMessage({
    aiMessageId: 2,
    createdAt: "2026-08-05T11:00:00+09:00",
    feedback: {
      aiFeedbackId: 9,
      feedbackType: "HELPFUL",
      reasons: null,
    },
  });
  const earlier = createMessage({ aiMessageId: 1 });

  assert.deepEqual(
    deduplicateMessages([later, earlier, later]).map(
      (message) => message.aiMessageId,
    ),
    [1, 2],
  );
  assert.deepEqual(collectFeedbackByMessage([earlier, later]), {
    2: "HELPFUL",
  });
});
