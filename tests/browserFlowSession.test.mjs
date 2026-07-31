import assert from "node:assert/strict";
import test from "node:test";

import { createBrowserFlowSession } from "../src/pages/auth/browserFlowSession.ts";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.get(key) ?? null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }

  clear() {
    this.#values.clear();
  }
}

function installBrowserStorageHarness(t) {
  const listeners = new Map();
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const originalSessionStorage = globalThis.sessionStorage;
  const originalBroadcastChannel = globalThis.BroadcastChannel;

  globalThis.localStorage = new MemoryStorage();
  globalThis.sessionStorage = new MemoryStorage();
  globalThis.BroadcastChannel = undefined;
  globalThis.window = {
    addEventListener(type, listener) {
      const typeListeners = listeners.get(type) ?? [];
      typeListeners.push(listener);
      listeners.set(type, typeListeners);
    },
    clearInterval() {},
    clearTimeout() {},
    setInterval() {
      return 1;
    },
    setTimeout(callback) {
      queueMicrotask(callback);
      return 1;
    },
  };

  t.after(() => {
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
    globalThis.sessionStorage = originalSessionStorage;
    globalThis.BroadcastChannel = originalBroadcastChannel;
  });

  return {
    pageHide() {
      for (const listener of listeners.get("pagehide") ?? []) {
        listener();
      }
    },
  };
}

test("agreement flow reload stays active but a closed tab is interrupted", async (t) => {
  const browser = installBrowserStorageHarness(t);
  const session = createBrowserFlowSession({ flowName: "agreement-test" });

  assert.equal(session.isPending(), false);
  session.start();
  assert.equal(session.isPending(), true);
  browser.pageHide();

  assert.equal(session.shouldCheckInterruption(), false);
  assert.equal(await session.wasInterrupted(), false);

  sessionStorage.clear();

  assert.equal(session.shouldCheckInterruption(), true);
  assert.equal(await session.wasInterrupted(), true);

  session.clear();
  assert.equal(session.isPending(), false);
});
