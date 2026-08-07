import assert from "node:assert/strict";
import test from "node:test";

import { formatChatDate, getTodayDateTime } from "../src/utils/date.ts";

test("채팅 날짜 표시와 로컬 날짜 키 형식을 유지한다", () => {
  assert.equal(getTodayDateTime(new Date(2026, 7, 5)), "2026-08-05");

  const formatted = formatChatDate("2026-08-05");
  assert.match(formatted, /2026/);
  assert.match(formatted, /8/);
  assert.match(formatted, /5/);
});
