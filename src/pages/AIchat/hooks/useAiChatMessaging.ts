import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { QueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/apis/apiError";
import { hasStoredAuthSession } from "@/apis/authApi";
import { showToast } from "@/components/Toast";
import { useCreateAiMessageMutation } from "@/hooks/useAiChat";
import type {
  ChatMessage,
  LoadingMessage,
  UserMessage,
} from "@/types/aiChat";
import { mapApiMessage } from "@/utils/aiChatMapper";
import { wait } from "@/utils/async";
import {
  getAiChatErrorCode,
  isAiChatTransportUncertainError,
  isAiTermsNotAgreedError,
} from "../aiChatErrors";
import { getAllTodayMessages } from "../aiChatData";

const SEND_SYNC_MAX_ATTEMPTS = 6;
const SEND_SYNC_INTERVAL_MS = 2_000;
const TERMINAL_AI_GENERATION_ERROR_CODES = new Set([
  "AI_RESPONSE_FAILED",
  "AI_RESPONSE_TIMEOUT",
  "AI_SOURCE_INVALID",
]);

interface UseAiChatMessagingOptions {
  queryClient: QueryClient;
  accessReady: boolean;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  hiddenTodayMessages: ChatMessage[];
  getSessionGeneration: () => number;
  isCurrentSession: (generation: number) => boolean;
  cancelHistoryScroll: () => void;
  onTermsRequired: () => void;
}

export function useAiChatMessaging({
  queryClient,
  accessReady,
  messages,
  setMessages,
  hiddenTodayMessages,
  getSessionGeneration,
  isCurrentSession,
  cancelHistoryScroll,
  onTermsRequired,
}: UseAiChatMessagingOptions) {
  const { mutateAsync: createAiMessageRequest } =
    useCreateAiMessageMutation();
  const nextLocalIdRef = useRef(-1);
  const sendInFlightRef = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const resetMessaging = useCallback(() => {
    setInputValue("");
    setMessages([]);
    sendInFlightRef.current = false;
    setIsSending(false);
  }, [setMessages]);

  const handleSend = async (preset?: string) => {
    const text = (preset ?? inputValue).trim();
    if (
      !text ||
      sendInFlightRef.current ||
      isSending ||
      !accessReady ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = getSessionGeneration();
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

    cancelHistoryScroll();
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
        onTermsRequired();
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
              current.filter((message) => message.id !== loadingMessage.id),
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
            onTermsRequired();
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

  return {
    inputValue,
    setInputValue,
    isSending,
    resetMessaging,
    handleSend,
  };
}
