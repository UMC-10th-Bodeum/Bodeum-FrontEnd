import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  getOnboardingResume,
  getOnboardingStatus,
  getRegions,
  quitOnboarding,
  registerChildProfile,
  registerGuardianProfile,
  registerInterestRegion,
  skipOnboarding,
} from "@/apis/onboardingApi";
import { queryKeys } from "@/queries/queryKeys";

const ONBOARDING_STATUS_STALE_TIME_MS = 2_000;

function invalidateOnboardingStatus(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.onboarding.status,
  });
}

export function onboardingStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.onboarding.status,
    queryFn: getOnboardingStatus,
    staleTime: ONBOARDING_STATUS_STALE_TIME_MS,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function onboardingResumeQueryOptions(
  options?: Parameters<typeof getOnboardingResume>[0],
) {
  return queryOptions({
    queryKey: [...queryKeys.onboarding.resume, options ?? null] as const,
    queryFn: () => getOnboardingResume(options),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function regionsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.onboarding.regions,
    queryFn: getRegions,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useRegions(enabled = true) {
  return useQuery({
    ...regionsQueryOptions(),
    enabled,
  });
}

export function useRegisterChildProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerChildProfile,
    onSuccess: () => invalidateOnboardingStatus(queryClient),
    retry: false,
  });
}

export function useRegisterInterestRegionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Parameters<typeof registerInterestRegion>[0]) => {
      const regions = await queryClient.fetchQuery(regionsQueryOptions());
      return registerInterestRegion(input, regions);
    },
    onSuccess: () => invalidateOnboardingStatus(queryClient),
    retry: false,
  });
}

export function useRegisterGuardianProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerGuardianProfile,
    onSuccess: () => invalidateOnboardingStatus(queryClient),
    retry: false,
  });
}

export function useSkipOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipOnboarding,
    onSuccess: () => invalidateOnboardingStatus(queryClient),
    retry: false,
  });
}

export function useQuitOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quitOnboarding,
    onSuccess: () => invalidateOnboardingStatus(queryClient),
    retry: false,
  });
}
