import { useCallback, useEffect, useState, type MutableRefObject } from "react";
import type { QueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/apis/apiError";
import {
  AUTH_STATE_CHANGED_EVENT,
  clearAuthTokens,
  hasStoredAuthSession,
} from "@/apis/authApi";
import { showToast } from "@/components/Toast";
import {
  aiChatRoomQueryOptions,
  aiTermsQueryOptions,
  useAgreeToAiTermsMutation,
  useConfirmAiChatGuideMutation,
  useCreateAiChatRoomMutation,
  useCreateAiChatStarterMutation,
} from "@/hooks/useAiChat";
import { userBriefQueryOptions } from "@/hooks/useUser";
import { queryKeys } from "@/queries/queryKeys";
import type {
  AiFeedbackType,
  ChatMessage,
  HistorySection,
} from "@/types/aiChat";
import {
  collectFeedbackByMessage,
  mapApiMessage,
  mapCurrentSessionMessages,
} from "@/utils/aiChatMapper";
import {
  ensureAiChatLoginSession,
  getAiChatSessionStarter,
  hasRevealedAiChatHistory,
  markAiChatSessionAsStarted,
  resetAiChatSession,
  storeAiChatSessionStarter,
} from "@/utils/aiChatSession";
import { getAllTodayMessages } from "../aiChatData";
import {
  partitionMessagesByLoginSession,
  resolveAiChatRoom,
} from "../aiChatFlow";
import { isAiTermsNotAgreedError } from "../aiChatErrors";
import { getRetainedHistorySections } from "./useAiChatHistory";

export type AiChatAccessState =
  | "loading"
  | "login-required"
  | "consent-required"
  | "ready"
  | "error";

export type AiChatAuthResolution = "checking" | "guest" | "authenticated";

interface InitializedAiChatState {
  messages: ChatMessage[];
  historySections: HistorySection[];
  hiddenTodayMessages: ChatMessage[];
  hasHiddenTodayMessages: boolean;
  hasPreviousMessages: boolean;
  isHistoryRevealed: boolean;
  isGuideOpen: boolean;
  feedbackByMessage: Record<number, AiFeedbackType>;
}

interface UseAiChatAccessControllerOptions {
  queryClient: QueryClient;
  consentChecked: boolean;
  noticeChecked: boolean;
  initializeRequestRef: MutableRefObject<number>;
  sessionGenerationRef: MutableRefObject<number>;
  authSessionPresentRef: MutableRefObject<boolean>;
  isCurrentSession: (generation: number) => boolean;
  resetUi: () => void;
  enterConsentRequiredState: () => void;
  setAccessState: (state: AiChatAccessState) => void;
  setAuthResolution: (resolution: AiChatAuthResolution) => void;
  clearMessages: () => void;
  applyInitializedState: (state: InitializedAiChatState) => void;
  setIsGuideOpen: (open: boolean) => void;
}

export function useAiChatAccessController({
  queryClient,
  consentChecked,
  noticeChecked,
  initializeRequestRef,
  sessionGenerationRef,
  authSessionPresentRef,
  isCurrentSession,
  resetUi,
  enterConsentRequiredState,
  setAccessState,
  setAuthResolution,
  clearMessages,
  applyInitializedState,
  setIsGuideOpen,
}: UseAiChatAccessControllerOptions) {
  const { mutateAsync: agreeToAiTermsRequest } =
    useAgreeToAiTermsMutation();
  const { mutateAsync: confirmAiChatGuideRequest } =
    useConfirmAiChatGuideMutation();
  const { mutateAsync: createAiChatRoomRequest } =
    useCreateAiChatRoomMutation();
  const { mutateAsync: createAiChatStarterRequest } =
    useCreateAiChatStarterMutation();
  const [isConsentSubmitting, setIsConsentSubmitting] = useState(false);
  const [isGuideSubmitting, setIsGuideSubmitting] = useState(false);
  const requireConsent = useCallback(() => {
    setIsConsentSubmitting(false);
    setIsGuideSubmitting(false);
    enterConsentRequiredState();
  }, [enterConsentRequiredState]);

  const initializeAiChat = useCallback(async () => {
    const requestId = ++initializeRequestRef.current;

    if (!hasStoredAuthSession()) {
      authSessionPresentRef.current = false;
      setAuthResolution("guest");
      resetAiChatSession();
      resetUi();
      setIsConsentSubmitting(false);
      setIsGuideSubmitting(false);
      setAccessState("login-required");
      return;
    }

    authSessionPresentRef.current = true;
    setAuthResolution("checking");
    setAccessState("loading");
    setIsGuideOpen(false);

    try {
      const user = await queryClient.fetchQuery(userBriefQueryOptions());
      if (requestId !== initializeRequestRef.current) return;

      if (!user.isLoggedIn) {
        setAuthResolution("guest");
        setAccessState("login-required");
        clearMessages();
        clearAuthTokens();
        return;
      }

      setAuthResolution("authenticated");
      const loginSession = ensureAiChatLoginSession(
        null,
        window.localStorage.getItem("accessToken"),
      );
      const terms = await queryClient.fetchQuery(aiTermsQueryOptions());
      if (requestId !== initializeRequestRef.current) return;

      if (!terms.aiTermsAgreed) {
        requireConsent();
        return;
      }

      const room = await resolveAiChatRoom(
        () => queryClient.fetchQuery(aiChatRoomQueryOptions()),
        createAiChatRoomRequest,
      );
      if (requestId !== initializeRequestRef.current) return;
      queryClient.setQueryData(queryKeys.aiChat.room, room);

      const starter = await createAiChatStarterRequest();
      if (requestId !== initializeRequestRef.current) return;

      const historyRevealed = hasRevealedAiChatHistory();
      const sessionStarter = getAiChatSessionStarter() ?? starter;
      storeAiChatSessionStarter(sessionStarter);
      const [todayMessages, retainedHistoryResult] = await Promise.all([
        getAllTodayMessages(queryClient),
        historyRevealed && room.hasPreviousMessages
          ? getRetainedHistorySections(queryClient)
          : Promise.resolve({
              sections: [] as HistorySection[],
              feedbackByMessage: {} as Record<number, AiFeedbackType>,
            }),
      ]);
      if (requestId !== initializeRequestRef.current) return;

      const partitionedTodayMessages = partitionMessagesByLoginSession(
        todayMessages,
        loginSession.sessionStartedAt,
      );
      const hiddenTodayMessages = partitionedTodayMessages.beforeLogin.map(
        (message) => mapApiMessage(message),
      );

      applyInitializedState({
        messages: mapCurrentSessionMessages(
          partitionedTodayMessages.currentSession,
          sessionStarter,
        ),
        historySections: retainedHistoryResult.sections,
        hiddenTodayMessages,
        hasHiddenTodayMessages:
          !historyRevealed && hiddenTodayMessages.length > 0,
        hasPreviousMessages: room.hasPreviousMessages,
        isHistoryRevealed: historyRevealed,
        isGuideOpen: room.showGuideModal,
        feedbackByMessage: {
          ...collectFeedbackByMessage(todayMessages),
          ...retainedHistoryResult.feedbackByMessage,
        },
      });
      setAccessState("ready");
      markAiChatSessionAsStarted();
    } catch (error: unknown) {
      if (requestId !== initializeRequestRef.current) return;

      if (isAiTermsNotAgreedError(error)) {
        requireConsent();
        return;
      }

      if (!hasStoredAuthSession()) {
        setAuthResolution("guest");
        setAccessState("login-required");
        clearMessages();
        return;
      }

      setAuthResolution("authenticated");
      setAccessState("error");
      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "AI 챗봇 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    }
  }, [
    applyInitializedState,
    authSessionPresentRef,
    clearMessages,
    createAiChatRoomRequest,
    createAiChatStarterRequest,
    initializeRequestRef,
    queryClient,
    requireConsent,
    resetUi,
    setAccessState,
    setAuthResolution,
    setIsGuideOpen,
  ]);

  useEffect(() => {
    void initializeAiChat();

    const handleAuthStateChanged = () => {
      const hasSession = hasStoredAuthSession();
      if (hasSession === authSessionPresentRef.current) return;

      authSessionPresentRef.current = hasSession;
      sessionGenerationRef.current += 1;
      if (!hasSession) setAuthResolution("guest");
      void initializeAiChat();
    };
    const handleStorageChanged = (event: StorageEvent) => {
      if (
        event.key === "accessToken" ||
        event.key === "refreshToken" ||
        event.key === null
      ) {
        handleAuthStateChanged();
      }
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);
    window.addEventListener("storage", handleStorageChanged);
    return () => {
      initializeRequestRef.current += 1;
      sessionGenerationRef.current += 1;
      window.removeEventListener(
        AUTH_STATE_CHANGED_EVENT,
        handleAuthStateChanged,
      );
      window.removeEventListener("storage", handleStorageChanged);
    };
  }, [
    authSessionPresentRef,
    initializeAiChat,
    initializeRequestRef,
    sessionGenerationRef,
    setAuthResolution,
  ]);

  const handleConsentSubmit = async () => {
    if (!consentChecked || isConsentSubmitting) return;

    const sessionGeneration = sessionGenerationRef.current;
    setIsConsentSubmitting(true);
    try {
      await agreeToAiTermsRequest();
      if (!isCurrentSession(sessionGeneration)) return;
      await initializeAiChat();
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;
      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "AI 챗봇 이용 동의를 저장하지 못했습니다. 다시 시도해주세요.",
        ),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) setIsConsentSubmitting(false);
    }
  };

  const handleGuideSubmit = async () => {
    if (!noticeChecked || isGuideSubmitting) return;

    const sessionGeneration = sessionGenerationRef.current;
    setIsGuideSubmitting(true);
    try {
      await confirmAiChatGuideRequest();
      if (!isCurrentSession(sessionGeneration)) return;
      setIsGuideOpen(false);
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;

      if (isAiTermsNotAgreedError(error)) {
        requireConsent();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "안내 확인 상태를 저장하지 못했습니다. 다시 시도해주세요.",
        ),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) setIsGuideSubmitting(false);
    }
  };

  return {
    initializeAiChat,
    isConsentSubmitting,
    isGuideSubmitting,
    handleConsentSubmit,
    handleGuideSubmit,
  };
}
