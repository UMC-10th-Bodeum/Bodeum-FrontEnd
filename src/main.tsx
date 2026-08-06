import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import {
  AUTH_STATE_CHANGED_EVENT,
  hasStoredAuthSession,
} from "./apis/authStorage";
import "./index.css";
import { queryKeys } from "./queries/queryKeys";
import { router } from "./router/router";

const queryClient = new QueryClient();

function clearSignedInUserQueries() {
  queryClient.removeQueries({ queryKey: queryKeys.user.all });
  queryClient.removeQueries({ queryKey: queryKeys.onboarding.all });
  queryClient.removeQueries({ queryKey: queryKeys.aiChat.all });
}

function handleAuthStateChanged() {
  if (!hasStoredAuthSession()) {
    clearSignedInUserQueries();
  }
}

window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);
import.meta.hot?.dispose(() => {
  window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
