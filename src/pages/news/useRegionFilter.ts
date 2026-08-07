import { useMyProfile } from "@/hooks/useMyPage";
import { useEffect, useState } from "react";
import { ALL_REGIONS_LABEL, ALL_REGIONS_VALUE } from "./components/RegionOnboardingBox";
import { formatRegionDisplayLabel } from "@/constants/regions";
import { getRegions } from "@/apis/onboardingApi";
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
  const profileQuery = useMyProfile(hasAuthSession);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    if (initialRegionLevel1 === ALL_REGIONS_VALUE) return ALL_REGIONS_LABEL;
    const initialRegion = [initialRegionLevel1, initialRegionLevel2].filter(Boolean).join(" ");
    return initialRegion ? formatRegionDisplayLabel(initialRegion) : "";
  });
  const [regionId, setRegionId] = useState<number>();
  const [regionLevel1, setRegionLevel1] = useState(initialRegionLevel1);
  const [regionLevel2, setRegionLevel2] = useState(initialRegionLevel2);
  const [isResolvingRegionId, setIsResolvingRegionId] = useState(Boolean(initialRegionLevel2));
  const [showRegionOnboarding, setShowRegionOnboarding] = useState(false);

  const [hasAppliedProfileDefault, setHasAppliedProfileDefault] = useState(false);

  useEffect(() => {
    const profile = profileQuery.data;
    const sido = profile?.regionLevel1?.trim();

    if (hasAppliedProfileDefault || regionLevel1 || !profile || !sido) {
      return;
    }

    const district =
      profile.regionLevel2 && profile.regionLevel2 !== sido ? profile.regionLevel2.trim() : "";
    const region = district ? `${sido} ${district}` : sido;

    setSelectedRegion(formatRegionDisplayLabel(region));
    setRegionId(profile.regionId ?? undefined);
    setRegionLevel1(sido);
    setRegionLevel2(district || undefined);
    setHasAppliedProfileDefault(true);
  }, [regionLevel1, profileQuery.data, hasAppliedProfileDefault]);

  useEffect(() => {
    let cancelled = false;

    async function syncFromUrl() {
      if (initialRegionLevel1 === ALL_REGIONS_VALUE) {
        setSelectedRegion(ALL_REGIONS_LABEL);
        setRegionId(undefined);
        setRegionLevel1(ALL_REGIONS_VALUE);
        setRegionLevel2(undefined);
        setIsResolvingRegionId(false);
        return;
      }

      if (!initialRegionLevel1) {
        setSelectedRegion("");
        setRegionId(undefined);
        setRegionLevel1(undefined);
        setRegionLevel2(undefined);
        setIsResolvingRegionId(false);
        return;
      }

      const region = [initialRegionLevel1, initialRegionLevel2].filter(Boolean).join(" ");
      setSelectedRegion(formatRegionDisplayLabel(region));
      setRegionLevel1(initialRegionLevel1);
      setRegionLevel2(initialRegionLevel2);

      if (!initialRegionLevel2) {
        setRegionId(undefined);
        setIsResolvingRegionId(false);
        return;
      }

      setIsResolvingRegionId(true);

      try {
        const nextRegionId = findRegionId(
          await getRegions(),
          initialRegionLevel1,
          initialRegionLevel2 ?? "",
        );
        if (!cancelled) setRegionId(nextRegionId);
      } catch {
        if (!cancelled) setRegionId(undefined);
      } finally {
        if (!cancelled) setIsResolvingRegionId(false);
      }
    }

    syncFromUrl();
    return () => {
      cancelled = true;
    };
  }, [initialRegionLevel1, initialRegionLevel2, regionLevel1, regionLevel2]);

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
      nextRegionId = findRegionId(await getRegions(), sido, district);
    } catch {
      // 시/군/구 ID 조회가 실패하면 시/도 전체 조회로 대체
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
    isRegionInitializing:
      isResolvingRegionId || (hasAuthSession && profileQuery.isPending && !regionLevel1),
    showRegionOnboarding,
    openRegionOnboarding: () => setShowRegionOnboarding(true),
    closeRegionOnboarding: () => setShowRegionOnboarding(false),
    completeRegionOnboarding,
  };
}
