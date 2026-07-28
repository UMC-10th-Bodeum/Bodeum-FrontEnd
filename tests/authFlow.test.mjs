import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveAuthPageFlow,
  resolvePostLoginNextStep,
  resolveProfileOnboardingDestination,
} from "../src/pages/auth/authFlow.ts";

test("incomplete required agreements always route to terms after login", () => {
  for (const nextStep of ["TERMS", "ONBOARDING", "HOME"]) {
    assert.equal(
      resolvePostLoginNextStep({
        agreementCompleted: false,
        nextStep,
      }),
      "TERMS",
    );
  }

  assert.equal(
    resolvePostLoginNextStep({
      agreementCompleted: true,
      nextStep: "ONBOARDING",
    }),
    "ONBOARDING",
  );
});

test("an explicit profile onboarding request ignores every cached next step", () => {
  for (const storedNextStep of [null, "TERMS", "ONBOARDING", "HOME"]) {
    assert.equal(
      resolveAuthPageFlow({
        requestedFlow: "onboarding",
        storedNextStep,
        isProfileOnboardingRequested: true,
      }),
      "onboarding",
    );
  }
});

test("terms and active signup onboarding keep their mandatory destinations", () => {
  const emptyProfile = {
    childProfileRegistered: false,
    interestRegionRegistered: false,
    guardianProfileRegistered: false,
  };

  assert.equal(
    resolveProfileOnboardingDestination({
      ...emptyProfile,
      nextStep: "TERMS",
    }),
    "agreement",
  );
  assert.equal(
    resolveProfileOnboardingDestination({
      ...emptyProfile,
      nextStep: "ONBOARDING",
    }),
    "onboarding",
  );
});

test("every resolved account with a missing profile stage reopens onboarding", () => {
  const registrationStates = [
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
  ];

  for (const [
    childProfileRegistered,
    interestRegionRegistered,
    guardianProfileRegistered,
  ] of registrationStates) {
    assert.equal(
      resolveProfileOnboardingDestination({
        nextStep: "HOME",
        childProfileRegistered,
        interestRegionRegistered,
        guardianProfileRegistered,
        onboardingCompleted: true,
      }),
      "profile",
    );
  }
});

test("only a profile with all three stages registered returns home", () => {
  assert.equal(
    resolveProfileOnboardingDestination({
      nextStep: "HOME",
      childProfileRegistered: true,
      interestRegionRegistered: true,
      guardianProfileRegistered: true,
      onboardingCompleted: false,
    }),
    "home",
  );
});
