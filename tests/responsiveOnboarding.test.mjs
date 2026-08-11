import assert from "node:assert/strict";
import test from "node:test";

import { calculateResponsiveScale } from "../src/pages/auth/responsiveOnboarding.ts";

test("기준 화면에서는 온보딩 박스를 확대하지 않는다", () => {
  assert.equal(
    calculateResponsiveScale({
      availableWidth: 1200,
      availableHeight: 900,
      contentWidth: 624,
      contentHeight: 747,
    }),
    1,
  );
});

test("작은 화면에서는 가로와 세로 중 더 부족한 비율로 균일 축소한다", () => {
  assert.equal(
    calculateResponsiveScale({
      availableWidth: 500,
      availableHeight: 500,
      contentWidth: 624,
      contentHeight: 747,
    }),
    500 / 747,
  );

  assert.equal(
    calculateResponsiveScale({
      availableWidth: 312,
      availableHeight: 700,
      contentWidth: 624,
      contentHeight: 747,
    }),
    0.5,
  );
});
