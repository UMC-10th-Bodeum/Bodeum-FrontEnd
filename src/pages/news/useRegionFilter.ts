import { useMyProfile } from "@/hooks/useMyPage";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ALL_REGIONS_LABEL, ALL_REGIONS_VALUE } from "./components/RegionOnboardingBox";
import { formatRegionDisplayLabel } from "@/constants/regions";
import { regionsQueryOptions } from "@/hooks/useOnboarding";
import { findRegionId } from "@/utils/onboarding";

type RegionCommit = {
  regionLevel1: string | null;
  regionLevel2: string | null;
};

export function useRegionFilter({
  initialRegionLevel1,
  initialRegionLevel2,
  hasAuthSession,
  onCommit,
}: {
  initialRegionLevel1?: string;
  initialRegionLevel2?: string;
  hasAuthSession: boolean;
  onCommit: (change: RegionCommit) => void;
}) {
  const queryClient = useQueryClient();
  const profileQuery = useMyProfile(hasAuthSession);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    if (initialRegionLevel1 === ALL_REGIONS_VALUE) return ALL_REGIONS_LABEL;
    const initialRegion = [initialRegionLevel1, initialRegionLevel2].filter(Boolean).join(" ");
    return initialRegion ? formatRegionDisplayLabel(initialRegion) : "";
  });
  const [regionId, setRegionId] = useState<number>();
  const [regionLevel1, setRegionLevel1] = useState(initialRegionLevel1);
  const [regionLevel2, setRegionLevel2] = useState(initialRegionLevel2);
  const [isRegionInitializing, setIsRegionInitializing] = useState(
    Boolean(initialRegionLevel2) || (hasAuthSession && !initialRegionLevel1),
  );
  const [showRegionOnboarding, setShowRegionOnboarding] = useState(false);

  const resolveRegionId = useCallback(
    async (sido: string, district: string) => {
      const regions = await queryClient.fetchQuery(regionsQueryOptions());
      return findRegionId(regions, sido, district);
    },
    [queryClient],
  );

  useEffect(() => {
    let cancelled = false;

    async function syncRegion() {
      if (initialRegionLevel1 === ALL_REGIONS_VALUE) {
        setSelectedRegion(ALL_REGIONS_LABEL);
        setRegionId(undefined);
        setRegionLevel1(ALL_REGIONS_VALUE);
        setRegionLevel2(undefined);
        setIsRegionInitializing(false);
        return;
      }

      if (!initialRegionLevel1) {
        if (hasAuthSession && profileQuery.isPending) {
          setIsRegionInitializing(true);
          return;
        }

        const profile = hasAuthSession ? profileQuery.data : undefined;
        const sido = profile?.regionLevel1?.trim();
        const district =
          sido && profile?.regionLevel2 && profile.regionLevel2 !== sido
            ? profile.regionLevel2.trim()
            : "";
        const region = sido ? [sido, district].filter(Boolean).join(" ") : "";

        setSelectedRegion(region ? formatRegionDisplayLabel(region) : "");
        setRegionId(profile?.regionId ?? undefined);
        setRegionLevel1(sido || undefined);
        setRegionLevel2(district || undefined);
        setIsRegionInitializing(false);
        return;
      }

      setIsRegionInitializing(Boolean(initialRegionLevel2));
      const region = [initialRegionLevel1, initialRegionLevel2].filter(Boolean).join(" ");
      setSelectedRegion(formatRegionDisplayLabel(region));
      setRegionLevel1(initialRegionLevel1);
      setRegionLevel2(initialRegionLevel2);

      if (!initialRegionLevel2) {
        setRegionId(undefined);
        setIsRegionInitializing(false);
        return;
      }

      try {
        const nextRegionId = await resolveRegionId(
          initialRegionLevel1,
          initialRegionLevel2 ?? "",
        );
        if (!cancelled) setRegionId(nextRegionId);
      } catch {
        if (!cancelled) setRegionId(undefined);
      } finally {
        if (!cancelled) setIsRegionInitializing(false);
      }
    }

    void syncRegion();
    return () => {
      cancelled = true;
    };
  }, [
    hasAuthSession,
    initialRegionLevel1,
    initialRegionLevel2,
    profileQuery.data,
    profileQuery.isPending,
    resolveRegionId,
  ]);

  const completeRegionOnboarding = async ({
    sido,
    district,
  }: {
    sido: string;
    district: string;
  }) => {
    if (sido === ALL_REGIONS_VALUE) {
      setSelectedRegion(ALL_REGIONS_LABEL);
      setRegionId(undefined);
      setRegionLevel1(ALL_REGIONS_VALUE);
      setRegionLevel2(undefined);
      onCommit({ regionLevel1: ALL_REGIONS_VALUE, regionLevel2: null });
      setShowRegionOnboarding(false);
      return;
    }

    const region = district ? `${sido} ${district}` : sido;
    let nextRegionId: number | undefined;

    try {
      nextRegionId = await resolveRegionId(sido, district);
    } catch {
      // regionId를 구하지 못하면 NewsPage가 regionLevel1으로 시·도 전체를 조회한다.
    }

    setSelectedRegion(formatRegionDisplayLabel(region));
    setRegionId(nextRegionId);
    setRegionLevel1(sido);
    setRegionLevel2(district || undefined);
    onCommit({ regionLevel1: sido, regionLevel2: district || null });
    setShowRegionOnboarding(false);
  };

  return {
    selectedRegion,
    regionId,
    regionLevel1,
    regionLevel2,
    isAllRegionsSelected: regionLevel1 === ALL_REGIONS_VALUE,
    isRegionInitializing,
    showRegionOnboarding,
    openRegionOnboarding: () => setShowRegionOnboarding(true),
    closeRegionOnboarding: () => setShowRegionOnboarding(false),
    completeRegionOnboarding,
  };
}
