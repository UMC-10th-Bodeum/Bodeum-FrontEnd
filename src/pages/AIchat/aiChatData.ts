import type { QueryClient } from "@tanstack/react-query";

import { todayAiMessagesInfiniteQueryOptions } from "@/hooks/useAiChat";
import { deduplicateMessages } from "@/utils/aiChatMapper";

const MAX_PAGINATION_REQUESTS = 50;

export async function getAllTodayMessages(queryClient: QueryClient) {
  const data = await queryClient.fetchInfiniteQuery({
    ...todayAiMessagesInfiniteQueryOptions(),
    pages: MAX_PAGINATION_REQUESTS,
  });

  return deduplicateMessages(
    data.pages.flatMap((page) => page.messages),
  );
}
