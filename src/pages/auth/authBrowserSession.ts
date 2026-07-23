import { createBrowserFlowSession } from "./browserFlowSession";

const authSession = createBrowserFlowSession({ flowName: "auth" });

export function startAuthBrowserSession() {
  authSession.start();
}

export function clearAuthBrowserSession() {
  authSession.clear();
}

export function isAuthBrowserSessionPending() {
  return authSession.isPending();
}

export function shouldCheckAuthBrowserSessionInterruption() {
  return authSession.shouldCheckInterruption();
}

export function wasAuthBrowserSessionInterrupted() {
  return authSession.wasInterrupted();
}
