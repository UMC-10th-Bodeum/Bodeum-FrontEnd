import api from "./axios";
import type { ApiResponse } from "./apiTypes";

export type AiSenderType = "USER" | "AI";
export type AiAnswerStatus = "ANSWERED" | "LINK_GUIDANCE" | "NO_EVIDENCE";
export type AiSourceType = "INFO" | "NEWS" | "SITE";
export type AiFeedbackType = "HELPFUL" | "INCORRECT";
export type AiFeedbackReason =
  | "TIME"
  | "ELIGIBILITY"
  | "BENEFIT"
  | "INSTITUTION_INFO"
  | "ETC";

export type AiTermsAgreement = {
  aiTermsAgreed: boolean;
  agreedAt: string | null;
};

export type AiChatRoom = {
  aiChatRoomId: number;
  createdAt: string;
  showGuideModal: boolean;
  hasTodayMessages: boolean;
  hasPreviousMessages: boolean;
};

export type AiChatStarter = {
  greeting: string;
  suggestedQuestions: string[];
};

export type AiGuideConfirmation = {
  lastGuideConfirmedAt: string;
};

export type AiTermsContent = {
  type: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type AiMessageSource = {
  sourceType: AiSourceType;
  sourceId: number;
  sourceTitle: string;
  sourceUrl: string;
  updatedAt: string | null;
};

export type AiMessage = {
  aiMessageId: number;
  senderType: AiSenderType;
  answerStatus: AiAnswerStatus | null;
  content: string;
  createdAt: string;
  sources: AiMessageSource[];
  warning?: {
    type: "INCORRECT_SOURCE";
    message: string;
  } | null;
};

export type AiMessageCursor = {
  id: number;
  createdAt: string;
};

export type AiMessagePage = {
  messages: AiMessage[];
  nextCursor: AiMessageCursor | null;
  hasNext: boolean;
};

export type AiHistoryDateGroup = {
  date: string;
  items: AiMessage[];
};

export type AiHistoryPage = {
  messages: AiHistoryDateGroup[];
  nextCursor: AiMessageCursor | null;
  hasNext: boolean;
};

export type CreateAiFeedbackRequest = {
  feedbackType: AiFeedbackType;
  reasons?: AiFeedbackReason[];
};

export type CreateAiFeedbackResponse = {
  aiFeedbackId: number;
  feedbackType: AiFeedbackType;
  reasons: AiFeedbackReason[] | null;
};

export async function getAiTermsAgreement() {
  const { data } = await api.get<ApiResponse<AiTermsAgreement>>(
    "/api/v1/users/me/ai-terms",
  );

  return data.result;
}

export async function agreeToAiTerms() {
  const { data } = await api.post<ApiResponse<AiTermsAgreement>>(
    "/api/v1/users/me/ai-terms",
  );

  return data.result;
}

export async function getAiTermsContent() {
  const { data } = await api.get<ApiResponse<AiTermsContent>>(
    "/api/v1/terms/ai-chat",
  );

  return data.result;
}

export async function getAiChatRoom() {
  const { data } = await api.get<ApiResponse<AiChatRoom>>(
    "/api/v1/ai/chat-room",
  );

  return data.result;
}

export async function confirmAiChatGuide() {
  const { data } = await api.patch<ApiResponse<AiGuideConfirmation>>(
    "/api/v1/ai/chat-room/guide-confirmation",
  );

  return data.result;
}

export async function getAiChatStarter() {
  const { data } = await api.get<ApiResponse<AiChatStarter>>(
    "/api/v1/ai/chat-room/starter",
  );

  return data.result;
}

export async function getTodayAiMessages(cursor?: AiMessageCursor) {
  const { data } = await api.get<ApiResponse<AiMessagePage>>(
    "/api/v1/ai/messages/today",
    {
      params: cursor
        ? { cursorId: cursor.id, cursorCreatedAt: cursor.createdAt }
        : undefined,
    },
  );

  return data.result;
}

export async function getAiMessageHistory(cursor?: AiMessageCursor) {
  const { data } = await api.get<ApiResponse<AiHistoryPage>>(
    "/api/v1/ai/messages/history",
    {
      params: cursor
        ? { cursorId: cursor.id, cursorCreatedAt: cursor.createdAt }
        : undefined,
    },
  );

  return data.result;
}

export async function createAiMessage(content: string) {
  const { data } = await api.post<ApiResponse<{ aiMessage: AiMessage }>>(
    "/api/v1/ai/chat-room/messages",
    { content },
    { timeout: 120_000 },
  );

  return data.result.aiMessage;
}

export async function createAiFeedback(
  aiMessageId: number,
  request: CreateAiFeedbackRequest,
) {
  const { data } = await api.post<ApiResponse<CreateAiFeedbackResponse>>(
    `/api/v1/ai/messages/${aiMessageId}/feedback`,
    request,
  );

  return data.result;
}
