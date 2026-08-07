import { queryOptions, useQuery } from "@tanstack/react-query";

import { getUserBrief } from "@/apis/userApi";
import { queryKeys } from "@/queries/queryKeys";

const USER_BRIEF_STALE_TIME_MS = 250;

export function userBriefQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.user.brief,
    queryFn: getUserBrief,
    staleTime: USER_BRIEF_STALE_TIME_MS,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUserBrief() {
  return useQuery(userBriefQueryOptions());
}
