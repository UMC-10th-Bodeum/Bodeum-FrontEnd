import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
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

export function onboardingStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.onboarding.status,
    queryFn: getOnboardingStatus,
    staleTime: 0,
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
  return useMutation({
    mutationFn: registerChildProfile,
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
    retry: false,
  });
}

export function useRegisterGuardianProfileMutation() {
  return useMutation({
    mutationFn: registerGuardianProfile,
    retry: false,
  });
}

export function useSkipOnboardingMutation() {
  return useMutation({
    mutationFn: skipOnboarding,
    retry: false,
  });
}

export function useQuitOnboardingMutation() {
  return useMutation({
    mutationFn: quitOnboarding,
    retry: false,
  });
}
