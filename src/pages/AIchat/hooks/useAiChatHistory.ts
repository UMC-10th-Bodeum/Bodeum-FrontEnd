import { useCallback, useEffect, useRef, useState } from "react";
import type { QueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/apis/apiError";
import { hasStoredAuthSession } from "@/apis/authApi";
import { showToast } from "@/components/Toast";
import { aiMessageHistoryInfiniteQueryOptions } from "@/hooks/useAiChat";
import type {
  AiFeedbackType,
  AiHistoryDateGroup,
  AiMessage,
  ChatMessage,
  HistorySection,
} from "@/types/aiChat";
import {
  collectFeedbackByMessage,
  deduplicateMessages,
  mapApiMessage,
} from "@/utils/aiChatMapper";
import {
  hasRevealedAiChatHistory,
  markAiChatHistoryAsRevealed,
} from "@/utils/aiChatSession";
import { formatChatDate } from "@/utils/date";
import { isAiTermsNotAgreedError } from "../aiChatErrors";

const MAX_PAGINATION_REQUESTS = 50;

interface HistoryLoadResult {
  sections: HistorySection[];
  feedbackByMessage: Record<number, AiFeedbackType>;
}

interface UseAiChatHistoryOptions {
  queryClient: QueryClient;
  messages: ChatMessage[];
  accessReady: boolean;
  getSessionGeneration: () => number;
  isCurrentSession: (generation: number) => boolean;
  onTermsRequired: () => void;
  mergeFeedbackByMessage: (feedback: Record<number, AiFeedbackType>) => void;
}

export async function getRetainedHistorySections(
  queryClient: QueryClient,
): Promise<HistoryLoadResult> {
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

  return {
    feedbackByMessage: collectFeedbackByMessage(
      Array.from(groups.values()).flat(),
    ),
    sections: Array.from(groups.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([dateTime, items]) => ({
        date: formatChatDate(dateTime),
        dateTime,
        messages: deduplicateMessages(items).map((message) =>
          mapApiMessage(message),
        ),
      })),
  };
}

export function useAiChatHistory({
  queryClient,
  messages,
  accessReady,
  getSessionGeneration,
  isCurrentSession,
  onTermsRequired,
  mergeFeedbackByMessage,
}: UseAiChatHistoryOptions) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestHistorySectionRef = useRef<HTMLDivElement>(null);
  const latestHiddenTodayMessageRef = useRef<HTMLDivElement>(null);
  const historyScrollAnimationRef = useRef<number | null>(null);
  const historyRevealBottomOffsetRef = useRef<number | null>(null);
  const historyRevealTargetRef = useRef<"past" | "today">("past");
  const [historySections, setHistorySections] = useState<HistorySection[]>([]);
  const [hiddenTodayMessages, setHiddenTodayMessages] = useState<ChatMessage[]>([]);
  const [hasHiddenTodayMessages, setHasHiddenTodayMessages] = useState(false);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryRevealed, setIsHistoryRevealed] = useState(
    hasRevealedAiChatHistory,
  );

  const cancelHistoryScroll = useCallback(() => {
    if (historyScrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(historyScrollAnimationRef.current);
      historyScrollAnimationRef.current = null;
    }
  }, []);

  const resetHistory = useCallback(() => {
    cancelHistoryScroll();
    setHistorySections([]);
    setHiddenTodayMessages([]);
    setHasHiddenTodayMessages(false);
    setHasPreviousMessages(false);
    setIsHistoryRevealed(false);
    setIsHistoryLoading(false);
  }, [cancelHistoryScroll]);

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

  useEffect(() => cancelHistoryScroll, [cancelHistoryScroll]);

  const handleHistoryClick = async () => {
    const messagesContainer = messagesRef.current;
    if (
      !messagesContainer ||
      isHistoryRevealed ||
      isHistoryLoading ||
      !accessReady ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = getSessionGeneration();
    cancelHistoryScroll();
    historyRevealBottomOffsetRef.current =
      messagesContainer.scrollHeight - messagesContainer.scrollTop;
    setIsHistoryLoading(true);

    try {
      const retainedHistoryResult = hasPreviousMessages
        ? await getRetainedHistorySections(queryClient)
        : { sections: [], feedbackByMessage: {} };
      if (!isCurrentSession(sessionGeneration)) return;

      const mappedTodayMessages = hasHiddenTodayMessages
        ? hiddenTodayMessages
        : [];
      setHistorySections(retainedHistoryResult.sections);
      mergeFeedbackByMessage(retainedHistoryResult.feedbackByMessage);
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
        onTermsRequired();
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

  return {
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
  };
}
