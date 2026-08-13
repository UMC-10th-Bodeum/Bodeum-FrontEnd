import { createBrowserFlowSession } from "./browserFlowSession";

const agreementSession = createBrowserFlowSession({ flowName: "agreement" });
const AGREEMENT_INTERRUPTED_NOTICE_KEY =
  "bodeum:agreement-interrupted-logout-notice";

export function clearAgreementBrowserSession() {
  agreementSession.clear();
}

export function clearAgreementInterruptedLogoutNotice() {
  localStorage.removeItem(AGREEMENT_INTERRUPTED_NOTICE_KEY);
}
