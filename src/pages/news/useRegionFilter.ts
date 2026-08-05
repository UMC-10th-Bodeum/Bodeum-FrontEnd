import { useMyProfile } from "@/hooks/useMyPage";
import { useEffect, useState } from "react";
import { ALL_REGIONS_LABEL, ALL_REGIONS_VALUE } from "./components/RegionOnboardingBox";
import { formatRegionDisplayLabel } from "@/constants/regions";
import { findRegionId, getRegions } from "@/apis/onboardingApi";

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
  const [showRegionOnboarding, setShowRegionOnboarding] = useState(false);

  useEffect(() => {
    const profile = profileQuery.data;
    const sido = profile?.regionLevel1?.trim();

    if (regionLevel1 || !profile || !sido) {
      return;
    }

    const district =
      profile.regionLevel2 && profile.regionLevel2 !== sido ? profile.regionLevel2.trim() : "";
    const region = district ? `${sido} ${district}` : sido;

    setSelectedRegion(formatRegionDisplayLabel(region));
    setRegionId(profile.regionId ?? undefined);
    setRegionLevel1(sido);
    setRegionLevel2(district || undefined);
  }, [regionLevel1, profileQuery.data]);

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
    isRegionInitializing: hasAuthSession && profileQuery.isPending,
    showRegionOnboarding,
    openRegionOnboarding: () => setShowRegionOnboarding(true),
    closeRegionOnboarding: () => setShowRegionOnboarding(false),
    completeRegionOnboarding,
  };
}
