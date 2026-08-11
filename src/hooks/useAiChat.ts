import { infiniteQueryOptions, queryOptions, useMutation } from "@tanstack/react-query";

import {
  agreeToAiTerms,
  confirmAiChatGuide,
  createAiChatRoom,
  createAiChatStarter,
  createAiFeedback,
  createAiMessage,
  getAiChatRoom,
  getAiMessageHistory,
  getAiTermsAgreement,
  getTodayAiMessages,
} from "@/apis/aiChatApi";
import { queryKeys } from "@/queries/queryKeys";
import type {
  AiMessageCursor,
  CreateAiFeedbackRequest,
} from "@/types/aiChat";

const sharedQueryPolicy = {
  staleTime: 0,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

export function aiTermsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.aiChat.terms,
    queryFn: getAiTermsAgreement,
    ...sharedQueryPolicy,
  });
}

export function aiChatRoomQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.aiChat.room,
    queryFn: getAiChatRoom,
    ...sharedQueryPolicy,
  });
}

export function todayAiMessagesInfiniteQueryOptions() {
  return infiniteQueryOptions({
    queryKey: queryKeys.aiChat.todayMessages,
    queryFn: ({ pageParam }) => getTodayAiMessages(pageParam),
    initialPageParam: undefined as AiMessageCursor | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor
        ? lastPage.nextCursor
        : undefined,
    ...sharedQueryPolicy,
  });
}

export function aiMessageHistoryInfiniteQueryOptions() {
  return infiniteQueryOptions({
    queryKey: queryKeys.aiChat.history,
    queryFn: ({ pageParam }) => getAiMessageHistory(pageParam),
    initialPageParam: undefined as AiMessageCursor | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor
        ? lastPage.nextCursor
        : undefined,
    ...sharedQueryPolicy,
  });
}

export function useAgreeToAiTermsMutation() {
  return useMutation({
    mutationFn: agreeToAiTerms,
    retry: false,
  });
}

export function useConfirmAiChatGuideMutation() {
  return useMutation({
    mutationFn: confirmAiChatGuide,
    retry: false,
  });
}

export function useCreateAiChatRoomMutation() {
  return useMutation({
    mutationFn: createAiChatRoom,
    retry: false,
  });
}

export function useCreateAiChatStarterMutation() {
  return useMutation({
    mutationFn: createAiChatStarter,
    retry: false,
  });
}

export function useCreateAiMessageMutation() {
  return useMutation({
    mutationFn: createAiMessage,
    retry: false,
  });
}

export function useCreateAiFeedbackMutation() {
  return useMutation({
    mutationFn: ({
      aiMessageId,
      request,
    }: {
      aiMessageId: number;
      request: CreateAiFeedbackRequest;
    }) => createAiFeedback(aiMessageId, request),
    retry: false,
  });
}
