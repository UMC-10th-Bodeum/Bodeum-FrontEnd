import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "@/apis/apiError";
import {
  AUTH_STATE_CHANGED_EVENT,
  clearAuthTokens,
  hasStoredAuthSession,
} from "@/apis/authApi";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";
import { legalLinks } from "@/constants/legalLinks";
import {
  aiChatRoomQueryOptions,
  aiMessageHistoryInfiniteQueryOptions,
  aiTermsQueryOptions,
  todayAiMessagesInfiniteQueryOptions,
  useAgreeToAiTermsMutation,
  useConfirmAiChatGuideMutation,
  useCreateAiChatRoomMutation,
  useCreateAiChatStarterMutation,
  useCreateAiFeedbackMutation,
  useCreateAiMessageMutation,
} from "@/hooks/useAiChat";
import { userBriefQueryOptions } from "@/hooks/useUser";
import { queryKeys } from "@/queries/queryKeys";
import type {
  AiFeedbackReason,
  AiFeedbackType,
  AiHistoryDateGroup,
  AiMessage,
  ChatMessage,
  HistorySection,
  LoadingMessage,
  UserMessage,
} from "@/types/aiChat";
import {
  collectFeedbackByMessage,
  deduplicateMessages,
  mapApiMessage,
  mapCurrentSessionMessages,
  shouldShowAiMessageFeedback,
} from "@/utils/aiChatMapper";
import { wait } from "@/utils/async";
import {
  ensureAiChatLoginSession,
  getAiChatSessionStarter,
  hasRevealedAiChatHistory,
  markAiChatHistoryAsRevealed,
  markAiChatSessionAsStarted,
  resetAiChatSession,
  storeAiChatSessionStarter,
} from "@/utils/aiChatSession";
import { formatChatDate, getTodayDateTime } from "@/utils/date";

import {
  AiCheckbox,
  AiChatPanel,
  AiMessageBot,
  AiMessageBubble,
  DateDivider,
  type AiInputVariant,
} from "./components";
import {
  partitionMessagesByLoginSession,
  resolveAiChatRoom,
  resolveAiChatEntryModal,
  shouldShowPreviousHistoryButton,
} from "./aiChatFlow";
import {
  getAiChatErrorCode,
  isAiChatTransportUncertainError,
  isAiTermsNotAgreedError,
} from "./aiChatErrors";
import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import Modal from "@/components/modal/Modal";

const MAX_MESSAGE_LENGTH = 500;
const MAX_PAGINATION_REQUESTS = 50;
const SEND_SYNC_MAX_ATTEMPTS = 6;
const SEND_SYNC_INTERVAL_MS = 2_000;
const TERMINAL_AI_GENERATION_ERROR_CODES = new Set([
  "AI_RESPONSE_FAILED",
  "AI_RESPONSE_TIMEOUT",
  "AI_SOURCE_INVALID",
]);

const FEEDBACK_REASONS: Array<{
  label: string;
  value: AiFeedbackReason;
}> = [
  { label: "신청 기간이나 운영 시간", value: "TIME" },
  { label: "지원 대상(자격 요건)", value: "ELIGIBILITY" },
  { label: "금액이나 혜택 내용", value: "BENEFIT" },
  { label: "전화번호나 위치 정보", value: "INSTITUTION_INFO" },
  { label: "기타", value: "ETC" },
];

type AccessState =
  | "loading"
  | "login-required"
  | "consent-required"
  | "ready"
  | "error";

type AuthResolution = "checking" | "guest" | "authenticated";

function UserMessageRow({ text }: { text: string }) {
  return (
    <article className="flex w-full flex-col items-end justify-center gap-[16px] py-[12px]">
      <AiMessageBubble variant="user" message={text} />
    </article>
  );
}

async function getAllTodayMessages(queryClient: QueryClient) {
  const data = await queryClient.fetchInfiniteQuery({
    ...todayAiMessagesInfiniteQueryOptions(),
    pages: MAX_PAGINATION_REQUESTS,
  });

  return deduplicateMessages(
    data.pages.flatMap((page) => page.messages),
  );
}

async function getRetainedHistorySections(queryClient: QueryClient) {
  const groups = new Map<string, AiMessage[]>();

  const data = await queryClient.fetchInfiniteQuery({
    ...aiMessageHistoryInfiniteQueryOptions(),
    pages: MAX_PAGINATION_REQUESTS,
  });

  data.pages.forEach((page) => {
    page.messages.forEach((group: AiHistoryDateGroup) => {
      groups.set(group.date, [
        ...(groups.get(group.date) ?? []),
        ...group.items,
      ]);
    });
  });

  const feedbackByMessage = collectFeedbackByMessage(
    Array.from(groups.values()).flat(),
  );
  const sections = Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dateTime, items]) => ({
      date: formatChatDate(dateTime),
      dateTime,
      messages: deduplicateMessages(items).map((message) =>
        mapApiMessage(message),
      ),
    }));

  return { sections, feedbackByMessage };
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: agreeToAiTermsRequest } =
    useAgreeToAiTermsMutation();
  const { mutateAsync: confirmAiChatGuideRequest } =
    useConfirmAiChatGuideMutation();
  const { mutateAsync: createAiChatRoomRequest } =
    useCreateAiChatRoomMutation();
  const { mutateAsync: createAiChatStarterRequest } =
    useCreateAiChatStarterMutation();
  const { mutateAsync: createAiMessageRequest } =
    useCreateAiMessageMutation();
  const { mutateAsync: createAiFeedbackRequest } =
    useCreateAiFeedbackMutation();
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestHistorySectionRef = useRef<HTMLDivElement>(null);
  const latestHiddenTodayMessageRef = useRef<HTMLDivElement>(null);
  const historyScrollAnimationRef = useRef<number | null>(null);
  const historyRevealBottomOffsetRef = useRef<number | null>(null);
  const historyRevealTargetRef = useRef<"past" | "today">("past");
  const nextLocalIdRef = useRef(-1);
  const initializeRequestRef = useRef(0);
  const sessionGenerationRef = useRef(0);
  const authSessionPresentRef = useRef(hasStoredAuthSession());
  const sendInFlightRef = useRef(false);

  const [accessState, setAccessState] = useState<AccessState>(() =>
    hasStoredAuthSession() ? "loading" : "login-required",
  );
  const [authResolution, setAuthResolution] = useState<AuthResolution>(() =>
    hasStoredAuthSession() ? "checking" : "guest",
  );
  const [noticeChecked, setNoticeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historySections, setHistorySections] = useState<HistorySection[]>([]);
  const [hiddenTodayMessages, setHiddenTodayMessages] = useState<ChatMessage[]>([]);
  const [hasHiddenTodayMessages, setHasHiddenTodayMessages] = useState(false);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryRevealed, setIsHistoryRevealed] = useState(
    hasRevealedAiChatHistory,
  );
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConsentSubmitting, setIsConsentSubmitting] = useState(false);
  const [isGuideSubmitting, setIsGuideSubmitting] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<number | null>(null);
  const [selectedFeedbackReasons, setSelectedFeedbackReasons] = useState<
    AiFeedbackReason[]
  >([]);
  const [feedbackByMessage, setFeedbackByMessage] = useState<
    Record<number, AiFeedbackType>
  >({});
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  const todayDateTime = useMemo(getTodayDateTime, []);
  const todayDate = useMemo(() => formatChatDate(todayDateTime), [todayDateTime]);

  const inputVariant: AiInputVariant = useMemo(() => {
    if (inputValue.includes("\n") || inputValue.length > 70) return "variant4";
    return inputValue.length > 0 ? "typing" : "default";
  }, [inputValue]);

  const isCurrentSession = useCallback(
    (generation: number) =>
      generation === sessionGenerationRef.current &&
      hasStoredAuthSession(),
    [],
  );

  const resetAiChatUiState = useCallback(() => {
    setMessages([]);
    setHistorySections([]);
    setHiddenTodayMessages([]);
    setHasHiddenTodayMessages(false);
    setHasPreviousMessages(false);
    setIsHistoryRevealed(false);
    setIsGuideOpen(false);
    setFeedbackOpen(false);
    setFeedbackMessageId(null);
    setSelectedFeedbackReasons([]);
    setFeedbackByMessage({});
    setInputValue("");
    sendInFlightRef.current = false;
    setIsSending(false);
    setIsHistoryLoading(false);
    setIsConsentSubmitting(false);
    setIsGuideSubmitting(false);
    setIsFeedbackSubmitting(false);
  }, []);

  const enterConsentRequiredState = useCallback(() => {
    sessionGenerationRef.current += 1;
    setAuthResolution("authenticated");
    setAccessState("consent-required");
    resetAiChatUiState();
    setNoticeChecked(false);
    setConsentChecked(false);
  }, [resetAiChatUiState]);

  const initializeAiChat = useCallback(async () => {
    const requestId = ++initializeRequestRef.current;

    if (!hasStoredAuthSession()) {
      authSessionPresentRef.current = false;
      setAuthResolution("guest");
      resetAiChatSession();
      resetAiChatUiState();
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
        setMessages([]);
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
        enterConsentRequiredState();
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
      const mappedHiddenTodayMessages =
        partitionedTodayMessages.beforeLogin.map((message) =>
          mapApiMessage(message),
        );
      setMessages(
        mapCurrentSessionMessages(
          partitionedTodayMessages.currentSession,
          sessionStarter,
        ),
      );
      setHistorySections(retainedHistoryResult.sections);
      setHiddenTodayMessages(mappedHiddenTodayMessages);
      setHasHiddenTodayMessages(
        !historyRevealed && mappedHiddenTodayMessages.length > 0,
      );
      setHasPreviousMessages(room.hasPreviousMessages);
      setIsHistoryRevealed(historyRevealed);
      setIsGuideOpen(room.showGuideModal);
      setFeedbackByMessage({
        ...collectFeedbackByMessage(todayMessages),
        ...retainedHistoryResult.feedbackByMessage,
      });
      setAccessState("ready");
      markAiChatSessionAsStarted();
    } catch (error: unknown) {
      if (requestId !== initializeRequestRef.current) return;

      if (isAiTermsNotAgreedError(error)) {
        enterConsentRequiredState();
        return;
      }

      if (!hasStoredAuthSession()) {
        setAuthResolution("guest");
        setAccessState("login-required");
        setMessages([]);
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
    createAiChatRoomRequest,
    createAiChatStarterRequest,
    enterConsentRequiredState,
    queryClient,
    resetAiChatUiState,
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
  }, [initializeAiChat]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (messagesRef.current && !isHistoryLoading) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [messages, isHistoryLoading]);

  useEffect(() => {
    const bottomOffset = historyRevealBottomOffsetRef.current;
    if (!isHistoryRevealed || bottomOffset === null) return;

    const revealFrame = window.requestAnimationFrame(() => {
      const messagesContainer = messagesRef.current;
      const historyTarget =
        historyRevealTargetRef.current === "today"
          ? latestHiddenTodayMessageRef.current
          : latestHistorySectionRef.current;

      if (!messagesContainer || !historyTarget) {
        historyRevealBottomOffsetRef.current = null;
        return;
      }

      const startTop = Math.max(
        0,
        messagesContainer.scrollHeight - bottomOffset,
      );
      messagesContainer.scrollTop = startTop;

      const targetTop =
        messagesContainer.scrollTop +
        historyTarget.getBoundingClientRect().top -
        messagesContainer.getBoundingClientRect().top;
      const distance = targetTop - messagesContainer.scrollTop;
      const animationStartTop = messagesContainer.scrollTop;
      const duration = 900;
      const startedAt = window.performance.now();

      const animateScroll = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);

        messagesContainer.scrollTop =
          animationStartTop + distance * easedProgress;

        if (progress < 1) {
          historyScrollAnimationRef.current =
            window.requestAnimationFrame(animateScroll);
          return;
        }

        messagesContainer.scrollTop = targetTop;
        historyScrollAnimationRef.current = null;
        historyRevealBottomOffsetRef.current = null;
      };

      historyScrollAnimationRef.current =
        window.requestAnimationFrame(animateScroll);
    });

    return () => window.cancelAnimationFrame(revealFrame);
  }, [isHistoryRevealed]);

  useEffect(
    () => () => {
      if (historyScrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(historyScrollAnimationRef.current);
      }
    },
    [],
  );

  const handleSend = async (preset?: string) => {
    const text = (preset ?? inputValue).trim();
    if (
      !text ||
      sendInFlightRef.current ||
      isSending ||
      accessState !== "ready" ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = sessionGenerationRef.current;
    sendInFlightRef.current = true;
    const knownServerMessageIds = new Set(
      [...messages, ...hiddenTodayMessages]
        .filter((message) => message.id > 0)
        .map((message) => message.id),
    );

    const userMessage: UserMessage = {
      id: nextLocalIdRef.current--,
      role: "user",
      text,
    };
    const loadingMessage: LoadingMessage = {
      id: nextLocalIdRef.current--,
      role: "loading",
    };

    if (historyScrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(historyScrollAnimationRef.current);
      historyScrollAnimationRef.current = null;
    }

    setInputValue("");
    setIsSending(true);
    setMessages((current) => [...current, userMessage, loadingMessage]);

    try {
      const answer = await createAiMessageRequest(text);
      if (!isCurrentSession(sessionGeneration)) return;

      setMessages((current) => [
        ...current.filter((message) => message.id !== loadingMessage.id),
        mapApiMessage(answer),
      ]);
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;

      if (isAiTermsNotAgreedError(error)) {
        enterConsentRequiredState();
        return;
      }

      const errorCode = getAiChatErrorCode(error);
      const isTerminalGenerationError =
        errorCode !== undefined &&
        TERMINAL_AI_GENERATION_ERROR_CODES.has(errorCode);
      const isTransportUncertain = isAiChatTransportUncertainError(error);
      const maxSyncAttempts = isTransportUncertain
        ? SEND_SYNC_MAX_ATTEMPTS
        : 1;
      let syncResult: "answered" | "persisted" | "not-persisted" | "unknown" =
        "unknown";

      for (let attempt = 0; attempt < maxSyncAttempts; attempt += 1) {
        if (attempt > 0) await wait(SEND_SYNC_INTERVAL_MS);
        if (!isCurrentSession(sessionGeneration)) return;

        try {
          const latestTodayMessages = await getAllTodayMessages(queryClient);
          if (!isCurrentSession(sessionGeneration)) return;

          const persistedUserIndex = latestTodayMessages.findIndex(
            (message) =>
              message.senderType === "USER" &&
              message.content === text &&
              !knownServerMessageIds.has(message.aiMessageId),
          );

          if (persistedUserIndex < 0) {
            if (attempt + 1 < maxSyncAttempts) continue;

            syncResult = "not-persisted";
            setMessages((current) =>
              current.filter(
                (message) =>
                  message.id !== loadingMessage.id &&
                  message.id !== userMessage.id,
              ),
            );
            setInputValue(text);
            break;
          }

          const persistedTail = latestTodayMessages.slice(persistedUserIndex);
          const hasSyncedAnswer = persistedTail.some(
            (message, index) => index > 0 && message.senderType === "AI",
          );

          if (
            isTransportUncertain &&
            !hasSyncedAnswer &&
            attempt + 1 < maxSyncAttempts
          ) {
            continue;
          }

          if (isTerminalGenerationError) {
            syncResult = "not-persisted";
            setMessages((current) =>
              current.filter(
                (message) =>
                  message.id !== loadingMessage.id &&
                  message.id !== userMessage.id,
              ),
            );
            setInputValue(text);
            break;
          }

          if (isTransportUncertain && !hasSyncedAnswer) {
            syncResult = "unknown";
            setMessages((current) =>
              current.filter(
                (message) => message.id !== loadingMessage.id,
              ),
            );
            break;
          }

          const syncedMessages = persistedTail.map((message) =>
            mapApiMessage(message),
          );
          syncResult = hasSyncedAnswer ? "answered" : "persisted";

          setMessages((current) => {
            const next = current.filter(
              (message) =>
                message.id !== loadingMessage.id &&
                message.id !== userMessage.id,
            );
            const existingIds = new Set(next.map((message) => message.id));

            return [
              ...next,
              ...syncedMessages.filter(
                (message) => !existingIds.has(message.id),
              ),
            ];
          });
          break;
        } catch (syncError: unknown) {
          if (!isCurrentSession(sessionGeneration)) return;

          if (isAiTermsNotAgreedError(syncError)) {
            enterConsentRequiredState();
            return;
          }

          if (attempt + 1 < maxSyncAttempts) continue;

          setMessages((current) =>
            current.filter((message) => message.id !== loadingMessage.id),
          );
          break;
        }
      }

      if (syncResult === "answered") return;

      showToast(
        "yellow",
        syncResult === "unknown"
          ? "전송 결과를 확인하지 못했습니다. 중복 전송하지 말고 잠시 후 대화 내역을 확인해주세요."
          : getApiErrorMessage(
              error,
              syncResult === "persisted"
                ? "질문은 전송되었지만 답변을 생성하지 못했습니다."
                : "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
            ),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) {
        sendInFlightRef.current = false;
        setIsSending(false);
      }
    }
  };

  const handleHistoryClick = async () => {
    const messagesContainer = messagesRef.current;
    if (
      !messagesContainer ||
      isHistoryRevealed ||
      isHistoryLoading ||
      accessState !== "ready" ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = sessionGenerationRef.current;

    if (historyScrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(historyScrollAnimationRef.current);
      historyScrollAnimationRef.current = null;
    }

    historyRevealBottomOffsetRef.current =
      messagesContainer.scrollHeight - messagesContainer.scrollTop;
    setIsHistoryLoading(true);

    try {
      const retainedHistoryResult = hasPreviousMessages
        ? await getRetainedHistorySections(queryClient)
        : {
            sections: [] as HistorySection[],
            feedbackByMessage: {} as Record<number, AiFeedbackType>,
          };
      if (!isCurrentSession(sessionGeneration)) return;

      const mappedTodayMessages = hasHiddenTodayMessages
        ? hiddenTodayMessages
        : [];
      setHistorySections(retainedHistoryResult.sections);
      setFeedbackByMessage((current) => ({
        ...current,
        ...retainedHistoryResult.feedbackByMessage,
      }));
      setHiddenTodayMessages(mappedTodayMessages);
      historyRevealTargetRef.current =
        mappedTodayMessages.length > 0 ? "today" : "past";
      markAiChatHistoryAsRevealed();
      setIsHistoryRevealed(true);
      setHasHiddenTodayMessages(false);
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;

      historyRevealBottomOffsetRef.current = null;

      if (isAiTermsNotAgreedError(error)) {
        enterConsentRequiredState();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "이전 대화를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) setIsHistoryLoading(false);
    }
  };

  const handleHelpfulFeedback = async (messageId: number) => {
    if (
      accessState !== "ready" ||
      !hasStoredAuthSession() ||
      feedbackByMessage[messageId]
    ) {
      return;
    }

    const sessionGeneration = sessionGenerationRef.current;

    setFeedbackByMessage((current) => ({
      ...current,
      [messageId]: "HELPFUL",
    }));

    try {
      await createAiFeedbackRequest({
        aiMessageId: messageId,
        request: { feedbackType: "HELPFUL" },
      });
      if (!isCurrentSession(sessionGeneration)) return;

      showToast("green", "소중한 의견 감사합니다!");
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;

      setFeedbackByMessage((current) => {
        const next = { ...current };
        delete next[messageId];
        return next;
      });

      if (isAiTermsNotAgreedError(error)) {
        enterConsentRequiredState();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "의견을 전달하지 못했습니다. 다시 시도해주세요.",
        ),
      );
    }
  };

  const openIncorrectFeedback = (messageId: number) => {
    if (
      accessState !== "ready" ||
      !hasStoredAuthSession() ||
      feedbackByMessage[messageId]
    ) {
      return;
    }
    setFeedbackMessageId(messageId);
    setSelectedFeedbackReasons([]);
    setFeedbackOpen(true);
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.role === "user") {
      return <UserMessageRow key={message.id} text={message.text} />;
    }

    if (message.role === "loading") {
      return <AiMessageBot key={message.id} variant="loading" />;
    }

    const serverId = message.serverId;
    const hasServerId = serverId !== undefined;
    const selectedFeedback = hasServerId
      ? feedbackByMessage[serverId] === "HELPFUL"
        ? "helpful"
        : feedbackByMessage[serverId] === "INCORRECT"
          ? "incorrect"
          : null
      : null;

    return (
      <AiMessageBot
        key={message.id}
        message={message.text}
        resources={message.resources}
        warning={message.warning}
        suggestions={message.suggestions}
        showFeedback={shouldShowAiMessageFeedback(message)}
        selectedFeedback={selectedFeedback}
        onSuggestionClick={(suggestion) => void handleSend(suggestion)}
        onGoodFeedback={
          hasServerId
            ? () => void handleHelpfulFeedback(serverId)
            : undefined
        }
        onBadFeedback={
          hasServerId
            ? () => openIncorrectFeedback(serverId)
            : undefined
        }
      />
    );
  };

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
      if (isCurrentSession(sessionGeneration)) {
        setIsConsentSubmitting(false);
      }
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
        enterConsentRequiredState();
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

  const toggleFeedbackReason = (reason: AiFeedbackReason) => {
    setSelectedFeedbackReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  const submitFeedback = async () => {
    if (
      feedbackMessageId === null ||
      selectedFeedbackReasons.length === 0 ||
      isFeedbackSubmitting ||
      accessState !== "ready" ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = sessionGenerationRef.current;
    setIsFeedbackSubmitting(true);
    try {
      await createAiFeedbackRequest({
        aiMessageId: feedbackMessageId,
        request: {
          feedbackType: "INCORRECT",
          reasons: selectedFeedbackReasons,
        },
      });
      if (!isCurrentSession(sessionGeneration)) return;

      setFeedbackByMessage((current) => ({
        ...current,
        [feedbackMessageId]: "INCORRECT",
      }));
      setFeedbackOpen(false);
      showToast(
        "green",
        "소중한 의견 감사합니다! 더 정확한 정보로 보답하겠습니다",
      );
    } catch (error: unknown) {
      if (!isCurrentSession(sessionGeneration)) return;

      if (isAiTermsNotAgreedError(error)) {
        enterConsentRequiredState();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(
          error,
          "의견을 전달하지 못했습니다. 다시 시도해주세요.",
        ),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) {
        setIsFeedbackSubmitting(false);
      }
    }
  };

  const effectiveAccessState: AccessState =
    authResolution === "guest"
      ? "login-required"
      : authResolution === "authenticated"
        ? accessState
        : "loading";
  const entryModalType = resolveAiChatEntryModal(
    effectiveAccessState,
    authResolution === "authenticated" && isGuideOpen,
  );
  const entryModal =
    entryModalType === "login-required" ? (
      <LoginRequiredModal
      open
      onClose={() => navigate(-1)}
    />
    ) : entryModalType === "consent-required" ? (
        <Modal
          open
    onClose={() => navigate(-1)}
        >
        <OnboardCancelBox
          title="대화를 시작하기 전, 이용 동의가 필요해요!"
          description={
            <div className="flex w-full flex-col items-start gap-[20px]">
              <p>
                AI 챗봇 서비스 이용에 동의하시면, 지금 바로 AI와 자유롭게
                <br />
                대화를 나누고 필요한 정보를 실시간으로 확인하실 수 있습니다.
              </p>
              <div className="flex items-center gap-[8px]">
                <AiCheckbox
                  checked={consentChecked}
                  onChange={(event) =>
                    setConsentChecked(event.target.checked)
                  }
                  label="(선택) AI 챗봇 이용 동의 방침"
                  className="gap-[4px] text-h2-onboard text-background-500"
                />
                <a
                  href={legalLinks.aiChatTerms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-h3-onboard text-background-500 underline underline-offset-2"
                >
                  전문보기
                </a>
              </div>
            </div>
          }
          leftButtonText="둘러보기"
          rightButtonText={isConsentSubmitting ? "저장 중..." : "시작하기"}
          rightButtonDisabled={!consentChecked || isConsentSubmitting}
          onLeftButtonClick={() => navigate(-1)}
          onRightButtonClick={() => void handleConsentSubmit()}
        />
      </Modal>
    ) : entryModalType === "guide" ? (
        <Modal
          open
          onClose={() => navigate(-1)}
        >
        <OnboardCancelBox
          title="AI 챗봇 이용 전 안내드립니다"
          description={
            <div className="flex w-full flex-col items-start gap-[16px]">
              <p>
                보듬 AI의 답변은 참고용이며 정확하지 않을 수 있습니다.
                <br />
                중요한 복지 혜택이나 바우처 신청 전,
                <br />
                정확한 요건은 반드시 공식 기관을 통해 다시 한번 확인해 주세요.
              </p>
              <AiCheckbox
                checked={noticeChecked}
                onChange={(event) => setNoticeChecked(event.target.checked)}
                label="네, 확인했습니다"
                className="gap-[4px] text-h2-onboard text-background-500"
              />
            </div>
          }
          leftButtonText="둘러보기"
          rightButtonText={isGuideSubmitting ? "저장 중..." : "시작하기"}
          rightButtonDisabled={!noticeChecked || isGuideSubmitting}
          onLeftButtonClick={() => navigate(-1)}
          onRightButtonClick={() => void handleGuideSubmit()}
        />
      </Modal>
    ) : null;

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
          onSend={() => void handleSend()}
          onHistoryClick={() => void handleHistoryClick()}
        >
          {effectiveAccessState === "error" && (
            <div
              role="alert"
              className="flex h-full min-h-full w-full flex-1 flex-col items-center justify-center gap-[12px] text-center"
            >
              <p className="text-h3-onboard text-background-600">
                대화를 불러오지 못했습니다.
              </p>
              <button
                type="button"
                onClick={() => void initializeAiChat()}
                className="cursor-pointer rounded-[10px] bg-main-400 px-[16px] py-[8px] text-h4-list text-background-100 transition-colors hover:bg-main-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
              >
                다시 시도
              </button>
            </div>
          )}

          {isHistoryRevealed &&
            historySections.map((section, index) => (
              <div
                key={section.dateTime}
                ref={
                  index === historySections.length - 1
                    ? latestHistorySectionRef
                    : undefined
                }
                className="w-full"
              >
                <DateDivider date={section.date} dateTime={section.dateTime} />
                {section.messages.map(renderMessage)}
              </div>
            ))}

          <div className="w-full">
            {isHistoryRevealed && (
              <DateDivider date={todayDate} dateTime={todayDateTime} />
            )}

            {isHistoryRevealed &&
              hiddenTodayMessages.map((message, index) => (
                <div
                  key={message.id}
                  ref={
                    index === hiddenTodayMessages.length - 1
                      ? latestHiddenTodayMessageRef
                      : undefined
                  }
                >
                  {renderMessage(message)}
                </div>
              ))}

            {messages.map(renderMessage)}
          </div>
        </AiChatPanel>
      </div>

      {entryModal}

      {feedbackOpen && (
        <Modal
          open
          onClose={() => setFeedbackOpen(false)}
        >
          <OnboardCancelBox
            title="어떤 정보가 잘못되었나요?"
            description={
              <div className="flex w-full flex-col items-start gap-[16px]">
                {FEEDBACK_REASONS.map((reason) => (
                  <AiCheckbox
                    key={reason.value}
                    checked={selectedFeedbackReasons.includes(reason.value)}
                    onChange={() => toggleFeedbackReason(reason.value)}
                    label={reason.label}
                    className="gap-[4px] text-h2-onboard text-background-500"
                  />
                ))}
              </div>
            }
            leftButtonText="취소"
            rightButtonText={
              isFeedbackSubmitting ? "전달 중..." : "의견 전달하기"
            }
            rightButtonDisabled={
              selectedFeedbackReasons.length === 0 || isFeedbackSubmitting
            }
            onLeftButtonClick={() => setFeedbackOpen(false)}
            onRightButtonClick={() => void submitFeedback()}
          />
        </Modal>
      )}
    </div>
  );
}
