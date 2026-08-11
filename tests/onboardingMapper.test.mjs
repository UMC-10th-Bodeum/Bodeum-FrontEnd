import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChildProfileRequest,
  buildGuardianProfileRequest,
  buildInterestRegionRequest,
  buildOnboardingDraft,
  createEmptyOnboardingDraft,
  findRegionId,
  resolveOnboardingStep,
} from "../src/utils/onboarding.ts";

test("빈 온보딩 폼은 기존 초기값을 유지한다", () => {
  assert.deepEqual(createEmptyOnboardingDraft(), {
    childName: "",
    birthYear: "",
    birthMonth: "",
    careAreas: [],
    childKeywords: "",
    interests: [],
    sido: "",
    district: "",
    guardianNickname: "",
    guardianType: "",
    guardianRole: "",
  });
});

test("온보딩 폼 값을 기존 서버 요청 형식으로 변환한다", () => {
  assert.deepEqual(
    buildChildProfileRequest({
      childName: "  보듬이  ",
      birthYear: "2020",
      birthMonth: "3",
      careAreas: ["자폐스펙트럼", "언어장애"],
      childKeywords: "  웃음이 많아요  ",
    }),
    {
      childNickname: "보듬이",
      birth: "2020-03",
      disabilityTypes: ["AUTISM", "LANGUAGE_DISORDER"],
      keywordText: "웃음이 많아요",
    },
  );

  assert.deepEqual(
    buildInterestRegionRequest(
      {
        interests: ["맞춤 복지·지원금", "성장·교육"],
        sido: "서울특별시",
        district: "강남구",
      },
      25,
    ),
    {
      interestCategories: ["WELFARE_SUBSIDY", "GROWTH_EDUCATION"],
      regionId: 25,
    },
  );

  assert.deepEqual(
    buildGuardianProfileRequest({
      guardianNickname: "  보호자  ",
      guardianType: "부모",
      guardianRole: "[정보 탐색자] : 기초 정보와 가이드가 필요한 단계",
    }),
    {
      guardianNickname: "보호자",
      guardianType: "PARENT",
      communityRoleType: "INFO_SEEKER",
    },
  );
});

test("서버 프로필을 기존 온보딩 폼 표시값으로 복원한다", () => {
  const profile = {
    userId: 1,
    nickname: null,
    email: null,
    provider: "kakao",
    profileImageUrl: null,
    point: 0,
    level: 1,
    badgeName: null,
    levelDescription: null,
    childProfile: {
      nickname: "아이",
      birth: "2021-04",
      disabilityTypes: [{ code: "ADHD", label: "주의력결핍 과잉행동장애" }],
    },
    keywordText: "활발해요",
    interestCategories: [
      { code: "HOSPITAL_HEALTH", label: "병원 및 건강" },
    ],
    regionId: 1,
    regionLevel1: "서울특별시",
    regionLevel2: "강남구",
    guardianNickname: "보호자",
    guardianType: "GRANDPARENT",
    communityRoleType: "EXPERIENCE_SHARER",
    joinedAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  assert.deepEqual(buildOnboardingDraft(profile), {
    childName: "아이",
    birthYear: "2021",
    birthMonth: "4",
    careAreas: ["ADHD"],
    childKeywords: "활발해요",
    interests: ["안심 병원·건강"],
    sido: "서울특별시",
    district: "강남구",
    guardianNickname: "보호자",
    guardianType: "조부모",
    guardianRole: "[경험 공유자] : 이웃과 가벼운 팁을 주고받고 싶은 단계",
  });
});

test("온보딩 단계와 지역 식별 규칙을 유지한다", () => {
  const baseStatus = {
    interestRegionRegistered: false,
    guardianProfileRegistered: false,
    onboardingCompleted: false,
    nextStep: "ONBOARDING",
  };

  assert.equal(
    resolveOnboardingStep({ ...baseStatus, childProfileRegistered: false }),
    1,
  );
  assert.equal(
    resolveOnboardingStep({ ...baseStatus, childProfileRegistered: true }),
    2,
  );

  const regions = [
    {
      regionId: 10,
      regionLevel1: "세종특별자치시",
      regionLevel2: "세종특별자치시",
      fullName: "세종특별자치시",
    },
    {
      regionId: 20,
      regionLevel1: "서울특별시",
      regionLevel2: "강남구",
      fullName: "서울특별시 강남구",
    },
  ];

  assert.equal(findRegionId(regions, "세종특별자치시", ""), 10);
  assert.equal(findRegionId(regions, "서울특별시", "강남구"), 20);
});

test("알 수 없는 온보딩 표시값은 기존과 동일하게 요청 전에 차단한다", () => {
  assert.throws(
    () =>
      buildChildProfileRequest({
        childName: "아이",
        birthYear: "2020",
        birthMonth: "1",
        careAreas: ["알 수 없는 값"],
        childKeywords: "",
      }),
    /집중 케어 영역 값을 서버 형식으로 변환하지 못했습니다/,
  );
});
