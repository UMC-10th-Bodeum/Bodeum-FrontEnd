type BrowserFlowSessionConfig = {
  flowName: string;
};

type PresenceMessage =
  | { type: "probe"; probeId: string }
  | { type: "active"; probeId: string };

type ActiveTabLeases = Record<string, number>;

const SESSION_VERSION = "1";
const PRESENCE_PROBE_MS = 300;
const TAB_LEASE_MS = 1_500;
const TAB_HEARTBEAT_MS = 500;

function wait(delay: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

export function createBrowserFlowSession({
  flowName,
}: BrowserFlowSessionConfig) {
  const pendingKey = `bodeum:pending-${flowName}`;
  const activeTabKey = `bodeum:active-${flowName}-tab`;
  const activeTabsKey = `bodeum:active-${flowName}-tabs`;
  const tabIdKey = `bodeum:${flowName}-tab-id`;
  const sessionVersionKey = `bodeum:${flowName}-session-version`;
  const channelName = `bodeum:${flowName}-presence`;

  let presenceChannel: BroadcastChannel | null = null;
  let heartbeatTimer: number | null = null;
  let pageHideCleanupRegistered = false;

  function getCurrentTabId() {
    const storedTabId = sessionStorage.getItem(tabIdKey);

    if (storedTabId) {
      return storedTabId;
    }

    const tabId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(tabIdKey, tabId);
    return tabId;
  }

  function getActiveTabLeases(): ActiveTabLeases {
    const storedTabs = localStorage.getItem(activeTabsKey);

    if (!storedTabs) {
      return {};
    }

    try {
      const parsedTabs = JSON.parse(storedTabs) as unknown;

      if (!parsedTabs || typeof parsedTabs !== "object") {
        return {};
      }

      return Object.fromEntries(
        Object.entries(parsedTabs).filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" && Number.isFinite(entry[1]),
        ),
      );
    } catch {
      localStorage.removeItem(activeTabsKey);
      return {};
    }
  }

  function storeActiveTabLeases(leases: ActiveTabLeases) {
    if (Object.keys(leases).length === 0) {
      localStorage.removeItem(activeTabsKey);
      return;
    }

    localStorage.setItem(activeTabsKey, JSON.stringify(leases));
  }

  function getFreshActiveTabLeases() {
    const expiresBefore = Date.now() - TAB_LEASE_MS;
    const freshLeases = Object.fromEntries(
      Object.entries(getActiveTabLeases()).filter(
        ([, lastSeenAt]) => lastSeenAt >= expiresBefore,
      ),
    );

    storeActiveTabLeases(freshLeases);
    return freshLeases;
  }

  function markCurrentTabActive() {
    const tabId = getCurrentTabId();
    const leases = getFreshActiveTabLeases();
    leases[tabId] = Date.now();
    storeActiveTabLeases(leases);
  }

  function releaseCurrentTab() {
    const tabId = sessionStorage.getItem(tabIdKey);

    if (!tabId) {
      return;
    }

    const leases = getActiveTabLeases();
    delete leases[tabId];
    storeActiveTabLeases(leases);
  }

  function stopPresence() {
    if (heartbeatTimer !== null) {
      window.clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }

    presenceChannel?.close();
    presenceChannel = null;
  }

  function ensurePresence() {
    if (typeof BroadcastChannel !== "function" || presenceChannel) {
      return;
    }

    try {
      presenceChannel = new BroadcastChannel(channelName);
    } catch {
      presenceChannel = null;
      return;
    }

    presenceChannel.addEventListener("message", (event) => {
      const message = event.data as PresenceMessage;

      if (
        message?.type !== "probe" ||
        localStorage.getItem(pendingKey) !== "true" ||
        sessionStorage.getItem(activeTabKey) !== "true"
      ) {
        return;
      }

      markCurrentTabActive();
      presenceChannel?.postMessage({
        type: "active",
        probeId: message.probeId,
      } satisfies PresenceMessage);
    });
  }

  function registerPageHideCleanup() {
    if (pageHideCleanupRegistered) {
      return;
    }

    pageHideCleanupRegistered = true;
    window.addEventListener("pagehide", () => {
      stopPresence();
      releaseCurrentTab();
    });
  }

  async function hasActiveTabInAnotherDocument() {
    if (typeof BroadcastChannel === "function") {
      try {
        const hasActiveBroadcastPeer = await new Promise<boolean>((resolve) => {
          const probeId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const probeChannel = new BroadcastChannel(channelName);
          let settled = false;

          const finish = (isActive: boolean) => {
            if (settled) {
              return;
            }

            settled = true;
            window.clearTimeout(timeoutId);
            probeChannel.close();
            resolve(isActive);
          };

          const timeoutId = window.setTimeout(
            () => finish(false),
            PRESENCE_PROBE_MS,
          );

          probeChannel.addEventListener("message", (event) => {
            const message = event.data as PresenceMessage;

            if (message?.type === "active" && message.probeId === probeId) {
              finish(true);
            }
          });
          probeChannel.postMessage({
            type: "probe",
            probeId,
          } satisfies PresenceMessage);
        });

        if (hasActiveBroadcastPeer) {
          return true;
        }
      } catch {
        // Fall through to the lease-based check below.
      }
    }

    if (Object.keys(getFreshActiveTabLeases()).length === 0) {
      return false;
    }

    await wait(TAB_LEASE_MS + TAB_HEARTBEAT_MS);
    return Object.keys(getFreshActiveTabLeases()).length > 0;
  }

  function start() {
    localStorage.setItem(pendingKey, "true");
    localStorage.setItem(sessionVersionKey, SESSION_VERSION);
    sessionStorage.setItem(activeTabKey, "true");
    markCurrentTabActive();
    ensurePresence();
    registerPageHideCleanup();

    if (heartbeatTimer === null) {
      heartbeatTimer = window.setInterval(
        markCurrentTabActive,
        TAB_HEARTBEAT_MS,
      );
    }
  }

  function clear() {
    stopPresence();
    releaseCurrentTab();
    localStorage.removeItem(pendingKey);
    localStorage.removeItem(activeTabsKey);
    localStorage.removeItem(sessionVersionKey);
    sessionStorage.removeItem(activeTabKey);
  }

  async function wasInterrupted() {
    const wasPending = localStorage.getItem(pendingKey) === "true";
    const wasActiveInThisTab =
      sessionStorage.getItem(activeTabKey) === "true";

    if (!wasPending || wasActiveInThisTab) {
      return false;
    }

    return !(await hasActiveTabInAnotherDocument());
  }

  function shouldCheckInterruption() {
    return (
      localStorage.getItem(pendingKey) === "true" &&
      sessionStorage.getItem(activeTabKey) !== "true"
    );
  }

  function isPending() {
    return localStorage.getItem(pendingKey) === "true";
  }

  return { start, clear, isPending, shouldCheckInterruption, wasInterrupted };
}
