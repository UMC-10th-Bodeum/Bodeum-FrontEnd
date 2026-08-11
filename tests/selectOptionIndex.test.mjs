import assert from "node:assert/strict";
import test from "node:test";

import { normalizeOptionIndex } from "../src/components/selectOptionIndex.ts";

test("셀렉트 초기 인덱스를 유한한 정수와 옵션 범위로 제한한다", () => {
  assert.equal(normalizeOptionIndex(4.9, 10), 4);
  assert.equal(normalizeOptionIndex(Number.NaN, 10), 0);
  assert.equal(normalizeOptionIndex(Number.POSITIVE_INFINITY, 10), 0);
  assert.equal(normalizeOptionIndex(-3, 10), 0);
  assert.equal(normalizeOptionIndex(20, 10), 9);
  assert.equal(normalizeOptionIndex(4, 0), 0);
});
