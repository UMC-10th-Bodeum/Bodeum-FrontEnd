import { createBrowserFlowSession } from "./browserFlowSession";

const agreementSession = createBrowserFlowSession({ flowName: "agreement" });
const AGREEMENT_INTERRUPTED_NOTICE_KEY =
  "bodeum:agreement-interrupted-logout-notice";

export function startAgreementBrowserSession() {
  agreementSession.start();
}

export function clearAgreementBrowserSession() {
  agreementSession.clear();
}

export function wasAgreementBrowserSessionInterrupted() {
  return agreementSession.wasInterrupted();
}

export function shouldCheckAgreementBrowserSessionInterruption() {
  return agreementSession.shouldCheckInterruption();
}

export function markAgreementInterruptedLogoutNotice() {
  localStorage.setItem(AGREEMENT_INTERRUPTED_NOTICE_KEY, "true");
}

export function consumeAgreementInterruptedLogoutNotice() {
  const shouldShow =
    localStorage.getItem(AGREEMENT_INTERRUPTED_NOTICE_KEY) === "true";
  localStorage.removeItem(AGREEMENT_INTERRUPTED_NOTICE_KEY);
  return shouldShow;
}

export function clearAgreementInterruptedLogoutNotice() {
  localStorage.removeItem(AGREEMENT_INTERRUPTED_NOTICE_KEY);
}
