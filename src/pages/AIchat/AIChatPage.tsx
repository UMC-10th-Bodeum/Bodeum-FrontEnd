import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { hasStoredAuthSession } from "@/apis/authApi";
import type {
  AiFeedbackType,
  ChatMessage,
  HistorySection,
} from "@/types/aiChat";
import { formatChatDate, getTodayDateTime } from "@/utils/date";

import {
  AiChatPanel,
  type AiInputVariant,
} from "./components";
import {
  resolveAiChatEntryModal,
  shouldShowPreviousHistoryButton,
} from "./aiChatFlow";
import { useAiFeedback } from "./hooks/useAiFeedback";
import { useAiChatHistory } from "./hooks/useAiChatHistory";
import { AiChatEntryModal, AiFeedbackModal } from "./components/AiChatModals";
import AiChatMessageList from "./components/AiChatMessageList";
import { useAiChatMessaging } from "./hooks/useAiChatMessaging";
import {
  useAiChatAccessController,
  type AiChatAccessState,
  type AiChatAuthResolution,
} from "./hooks/useAiChatAccessController";

const MAX_MESSAGE_LENGTH = 500;

export default function AIChatPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initializeRequestRef = useRef(0);
  const sessionGenerationRef = useRef(0);
  const authSessionPresentRef = useRef(hasStoredAuthSession());

  const [accessState, setAccessState] = useState<AiChatAccessState>(() =>
    hasStoredAuthSession() ? "loading" : "login-required",
  );
  const [authResolution, setAuthResolution] = useState<AiChatAuthResolution>(() =>
    hasStoredAuthSession() ? "checking" : "guest",
  );
  const [noticeChecked, setNoticeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const todayDateTime = useMemo(getTodayDateTime, []);
  const todayDate = useMemo(() => formatChatDate(todayDateTime), [todayDateTime]);

  const isCurrentSession = useCallback(
    (generation: number) =>
      generation === sessionGenerationRef.current &&
      hasStoredAuthSession(),
    [],
  );

  const enterConsentRequiredStateRef = useRef<() => void>(() => {});
  const handleTermsRequired = useCallback(
    () => enterConsentRequiredStateRef.current(),
    [],
  );
  const {
    feedbackOpen,
    setFeedbackOpen,
    selectedFeedbackReasons,
    feedbackByMessage,
    setFeedbackByMessage,
    isFeedbackSubmitting,
    resetFeedback,
    handleHelpfulFeedback,
    openIncorrectFeedback,
    toggleFeedbackReason,
    submitFeedback,
  } = useAiFeedback({
    accessReady: accessState === "ready",
    getSessionGeneration: () => sessionGenerationRef.current,
    isCurrentSession,
    onTermsRequired: handleTermsRequired,
  });

  const mergeFeedbackByMessage = useCallback(
    (feedback: Record<number, AiFeedbackType>) => {
      setFeedbackByMessage((current) => ({ ...current, ...feedback }));
    },
    [setFeedbackByMessage],
  );
  const {
    messagesRef,
    latestHistorySectionRef,
    latestHiddenTodayMessageRef,
    historySections,
    setHistorySections,
    hiddenTodayMessages,
    setHiddenTodayMessages,
    hasHiddenTodayMessages,
    setHasHiddenTodayMessages,
    hasPreviousMessages,
    setHasPreviousMessages,
    isHistoryLoading,
    isHistoryRevealed,
    setIsHistoryRevealed,
    cancelHistoryScroll,
    resetHistory,
    handleHistoryClick,
  } = useAiChatHistory({
    queryClient,
    messages,
    accessReady: accessState === "ready",
    getSessionGeneration: () => sessionGenerationRef.current,
    isCurrentSession,
    onTermsRequired: handleTermsRequired,
    mergeFeedbackByMessage,
  });

  const {
    inputValue,
    setInputValue,
    isSending,
    resetMessaging,
    handleSend: sendMessage,
  } = useAiChatMessaging({
    queryClient,
    accessReady: accessState === "ready",
    messages,
    setMessages,
    hiddenTodayMessages,
    getSessionGeneration: () => sessionGenerationRef.current,
    isCurrentSession,
    cancelHistoryScroll,
    onTermsRequired: handleTermsRequired,
  });
  const inputVariant: AiInputVariant = useMemo(() => {
    if (inputValue.includes("\n") || inputValue.length > 70) return "variant4";
    return inputValue.length > 0 ? "typing" : "default";
  }, [inputValue]);

  const resetAiChatUiState = useCallback(() => {
    resetMessaging();
    resetHistory();
    resetFeedback();
    setIsGuideOpen(false);
  }, [resetFeedback, resetHistory, resetMessaging]);

  const enterConsentRequiredState = useCallback(() => {
    sessionGenerationRef.current += 1;
    setAuthResolution("authenticated");
    setAccessState("consent-required");
    resetAiChatUiState();
    setNoticeChecked(false);
    setConsentChecked(false);
  }, [resetAiChatUiState]);
  enterConsentRequiredStateRef.current = enterConsentRequiredState;

  useEffect(() => {
    if (accessState !== "ready") {
      resetFeedback();
    }
  }, [accessState, resetFeedback]);

  const clearMessages = useCallback(() => setMessages([]), []);
  const applyInitializedState = useCallback(
    ({
      messages: initializedMessages,
      historySections: initializedHistorySections,
      hiddenTodayMessages: initializedHiddenTodayMessages,
      hasHiddenTodayMessages: initializedHasHiddenTodayMessages,
      hasPreviousMessages: initializedHasPreviousMessages,
      isHistoryRevealed: initializedIsHistoryRevealed,
      isGuideOpen: initializedIsGuideOpen,
      feedbackByMessage: initializedFeedbackByMessage,
    }: {
      messages: ChatMessage[];
      historySections: HistorySection[];
      hiddenTodayMessages: ChatMessage[];
      hasHiddenTodayMessages: boolean;
      hasPreviousMessages: boolean;
      isHistoryRevealed: boolean;
      isGuideOpen: boolean;
      feedbackByMessage: Record<number, AiFeedbackType>;
    }) => {
      setMessages(initializedMessages);
      setHistorySections(initializedHistorySections);
      setHiddenTodayMessages(initializedHiddenTodayMessages);
      setHasHiddenTodayMessages(initializedHasHiddenTodayMessages);
      setHasPreviousMessages(initializedHasPreviousMessages);
      setIsHistoryRevealed(initializedIsHistoryRevealed);
      setIsGuideOpen(initializedIsGuideOpen);
      setFeedbackByMessage(initializedFeedbackByMessage);
    },
    [
      setFeedbackByMessage,
      setHasHiddenTodayMessages,
      setHasPreviousMessages,
      setHiddenTodayMessages,
      setHistorySections,
      setIsHistoryRevealed,
    ],
  );
  const {
    initializeAiChat,
    isConsentSubmitting,
    isGuideSubmitting,
    handleConsentSubmit,
    handleGuideSubmit,
  } = useAiChatAccessController({
    queryClient,
    consentChecked,
    noticeChecked,
    initializeRequestRef,
    sessionGenerationRef,
    authSessionPresentRef,
    isCurrentSession,
    resetUi: resetAiChatUiState,
    enterConsentRequiredState,
    setAccessState,
    setAuthResolution,
    clearMessages,
    applyInitializedState,
    setIsGuideOpen,
  });

  const effectiveAccessState: AiChatAccessState =
    authResolution === "guest"
      ? "login-required"
      : authResolution === "authenticated"
        ? accessState
        : "loading";
  const entryModalType = resolveAiChatEntryModal(
    effectiveAccessState,
    authResolution === "authenticated" && isGuideOpen,
  );
  const showHistoryButton = shouldShowPreviousHistoryButton({
    accessReady:
      authResolution === "authenticated" && accessState === "ready",
    historyRevealed: isHistoryRevealed,
    historyLoading: isHistoryLoading,
    hasPreviousMessages,
    hasHiddenTodayMessages,
  });

  return (
    <div className="flex h-[calc(100vh-60px)] min-h-0 justify-center overflow-hidden bg-background-100 px-[27.5px] py-[20px]">
      <div className="flex h-full min-h-0 w-full flex-col items-center">
        <AiChatPanel
          inputValue={inputValue}
          inputVariant={inputVariant}
          inputDisabled={
            isSending ||
            isHistoryLoading ||
            authResolution !== "authenticated" ||
            accessState !== "ready" ||
            isGuideOpen
          }
          inputMaxLength={MAX_MESSAGE_LENGTH}
          showHistoryButton={showHistoryButton}
          messagesRef={messagesRef}
          onInputChange={setInputValue}
          onSend={() => void sendMessage()}
          onHistoryClick={() => void handleHistoryClick()}
        >
          <AiChatMessageList
            effectiveAccessState={effectiveAccessState}
            historySections={historySections}
            hiddenTodayMessages={hiddenTodayMessages}
            messages={messages}
            isHistoryRevealed={isHistoryRevealed}
            todayDate={todayDate}
            todayDateTime={todayDateTime}
            feedbackByMessage={feedbackByMessage}
            latestHistorySectionRef={latestHistorySectionRef}
            latestHiddenTodayMessageRef={latestHiddenTodayMessageRef}
            onRetry={() => void initializeAiChat()}
            onSuggestionClick={(suggestion) => void sendMessage(suggestion)}
            onHelpfulFeedback={(messageId) =>
              void handleHelpfulFeedback(messageId)
            }
            onIncorrectFeedback={openIncorrectFeedback}
          />
        </AiChatPanel>
      </div>

      <AiChatEntryModal
        type={entryModalType}
        consentChecked={consentChecked}
        noticeChecked={noticeChecked}
        isConsentSubmitting={isConsentSubmitting}
        isGuideSubmitting={isGuideSubmitting}
        onClose={() => navigate(-1)}
        onConsentChange={setConsentChecked}
        onNoticeChange={setNoticeChecked}
        onConsentSubmit={() => void handleConsentSubmit()}
        onGuideSubmit={() => void handleGuideSubmit()}
      />

      <AiFeedbackModal
        open={feedbackOpen}
        selectedReasons={selectedFeedbackReasons}
        isSubmitting={isFeedbackSubmitting}
        onClose={() => setFeedbackOpen(false)}
        onToggleReason={toggleFeedbackReason}
        onSubmit={() => void submitFeedback()}
      />
    </div>
  );
}
