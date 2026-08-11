import type { Region } from "@/types/onboarding";

export function createRegionOptions(regions: Region[]) {
  const sidoNames = [...new Set(regions.map((region) => region.regionLevel1))];

  const regionOptions = sidoNames.map((sido) => ({
    label: sido,
    value: sido,
  }));

  const districtOptionsByRegion = Object.fromEntries(
    sidoNames.map((sido) => {
      const districts = [
        ...new Set(
          regions
            .filter((region) => region.regionLevel1 === sido)
            .map((region) => region.regionLevel2)
            .filter((district): district is string => Boolean(district) && district !== sido),
        ),
      ];

      return [
        sido,
        districts.map((district) => ({
          label: district,
          value: district,
        })),
      ];
    }),
  );

  return {
    regionOptions,
    districtOptionsByRegion,
  };
}
