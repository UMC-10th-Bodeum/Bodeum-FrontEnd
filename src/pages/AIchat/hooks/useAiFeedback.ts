import { useCallback, useState } from "react";

import { getApiErrorMessage } from "@/apis/apiError";
import { hasStoredAuthSession } from "@/apis/authApi";
import { showToast } from "@/components/Toast";
import { useCreateAiFeedbackMutation } from "@/hooks/useAiChat";
import type { AiFeedbackReason, AiFeedbackType } from "@/types/aiChat";
import { isAiTermsNotAgreedError } from "../aiChatErrors";

interface UseAiFeedbackOptions {
  accessReady: boolean;
  getSessionGeneration: () => number;
  isCurrentSession: (generation: number) => boolean;
  onTermsRequired: () => void;
}

export function useAiFeedback({
  accessReady,
  getSessionGeneration,
  isCurrentSession,
  onTermsRequired,
}: UseAiFeedbackOptions) {
  const { mutateAsync: createAiFeedbackRequest } =
    useCreateAiFeedbackMutation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<number | null>(null);
  const [selectedFeedbackReasons, setSelectedFeedbackReasons] = useState<
    AiFeedbackReason[]
  >([]);
  const [feedbackByMessage, setFeedbackByMessage] = useState<
    Record<number, AiFeedbackType>
  >({});
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  const resetFeedback = useCallback(() => {
    setFeedbackOpen(false);
    setFeedbackMessageId(null);
    setSelectedFeedbackReasons([]);
    setFeedbackByMessage({});
    setIsFeedbackSubmitting(false);
  }, []);

  const handleHelpfulFeedback = async (messageId: number) => {
    if (!accessReady || !hasStoredAuthSession() || feedbackByMessage[messageId]) {
      return;
    }

    const sessionGeneration = getSessionGeneration();
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
        onTermsRequired();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(error, "의견을 전달하지 못했습니다. 다시 시도해주세요."),
      );
    }
  };

  const openIncorrectFeedback = (messageId: number) => {
    if (!accessReady || !hasStoredAuthSession() || feedbackByMessage[messageId]) {
      return;
    }

    setFeedbackMessageId(messageId);
    setSelectedFeedbackReasons([]);
    setFeedbackOpen(true);
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
      !accessReady ||
      !hasStoredAuthSession()
    ) {
      return;
    }

    const sessionGeneration = getSessionGeneration();
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
        onTermsRequired();
        return;
      }

      showToast(
        "yellow",
        getApiErrorMessage(error, "의견을 전달하지 못했습니다. 다시 시도해주세요."),
      );
    } finally {
      if (isCurrentSession(sessionGeneration)) {
        setIsFeedbackSubmitting(false);
      }
    }
  };

  return {
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
  };
}
