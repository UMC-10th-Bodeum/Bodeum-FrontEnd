import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type {
  AiChatRoom,
  AiChatStarter,
  AiGuideConfirmation,
  AiHistoryPage,
  AiMessage,
  AiMessageCursor,
  AiMessagePage,
  AiTermsAgreement,
  AiTermsContent,
  CreateAiFeedbackRequest,
  CreateAiFeedbackResponse,
} from "@/types/aiChat";

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
