import assert from "node:assert/strict";
import test from "node:test";

import {
  getAiChatErrorCode,
  isAiChatRoomConflictError,
  isAiChatRoomNotFoundError,
  isAiChatTransportUncertainError,
  isAiTermsNotAgreedError,
} from "../src/pages/AIchat/aiChatErrors.ts";

test("AI 약관 미동의 서버 오류는 동의 모달 복구 대상으로 판별한다", () => {
  const error = {
    response: {
      status: 403,
      data: {
        code: "AI403_1",
        message: "AI 챗봇 이용동의가 필요합니다.",
      },
    },
  };

  assert.equal(getAiChatErrorCode(error), "AI403_1");
  assert.equal(isAiTermsNotAgreedError(error), true);
});

test("일반 AI 오류와 비정상 오류 객체는 약관 미동의로 오판하지 않는다", () => {
  assert.equal(
    isAiTermsNotAgreedError({ response: { data: { code: "AI404_1" } } }),
    false,
  );
  assert.equal(isAiTermsNotAgreedError(new Error("network error")), false);
  assert.equal(getAiChatErrorCode({ response: { data: { code: 403 } } }), undefined);
});

test("응답 없는 timeout·network 오류만 전송 결과 불명으로 판별한다", () => {
  assert.equal(
    isAiChatTransportUncertainError({
      isAxiosError: true,
      code: "ECONNABORTED",
    }),
    true,
  );
  assert.equal(
    isAiChatTransportUncertainError({
      isAxiosError: true,
      code: "ERR_NETWORK",
    }),
    true,
  );
  assert.equal(
    isAiChatTransportUncertainError({
      isAxiosError: true,
      response: { status: 503, data: { code: "AI_RESPONSE_FAILED" } },
    }),
    false,
  );
  assert.equal(isAiChatTransportUncertainError(new Error("render error")), false);
});

test("채팅방 조회·생성 분기는 HTTP 상태와 오류 코드가 모두 일치해야 한다", () => {
  assert.equal(
    isAiChatRoomNotFoundError({
      response: { status: 404, data: { code: "AI404_1" } },
    }),
    true,
  );
  assert.equal(
    isAiChatRoomNotFoundError({
      response: { status: 500, data: { code: "AI404_1" } },
    }),
    false,
  );
  assert.equal(
    isAiChatRoomConflictError({
      response: { status: 409, data: { code: "AI409_1" } },
    }),
    true,
  );
  assert.equal(
    isAiChatRoomConflictError({
      response: { status: 404, data: { code: "AI409_1" } },
    }),
    false,
  );
});
