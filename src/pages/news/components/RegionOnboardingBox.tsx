import { useId, useState } from "react";

import OnboardBoxFrame from "@/components/OnboardBoxFrame";
import { Select } from "@/components/Select";
import { districtOptionsByRegion, regionOptions } from "@/constants/regions";

type RegionOnboardingBoxProps = {
  onClose: () => void;
  onComplete: (region: { sido: string; district: string }) => void;
};

const selectClassName = "z-[80] min-w-0 flex-1";
export const ALL_REGIONS_VALUE = "ALL";
export const ALL_REGIONS_LABEL = "지역 전체";
const REGION_OPTIONS_ALL_VALUE = regionOptions[0].value;

export default function RegionOnboardingBox({ onClose, onComplete }: RegionOnboardingBoxProps) {
  const titleId = useId();
  const [sido, setSido] = useState("");
  const [district, setDistrict] = useState("");
  const isAllRegions = sido === REGION_OPTIONS_ALL_VALUE;
  const districtOptions = isAllRegions ? [] : (districtOptionsByRegion[sido] ?? []);
  const districtRequired = districtOptions.length > 0;
  const shouldBlockDistrictSelect = isAllRegions || !sido || !districtRequired;
  const isComplete = isAllRegions || Boolean(sido && (!districtRequired || district));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div onClick={(event) => event.stopPropagation()}>
        <OnboardBoxFrame
          buttonCount={2}
          leftButtonText="나가기"
          rightButtonText="완료"
          showClose
          showOverlay={false}
          className="h-[482px]! w-[624px]! p-[44px]!"
          ariaLabelledby={titleId}
          rightButtonDisabled={!isComplete}
          onClose={onClose}
          onLeftButtonClick={onClose}
          onRightButtonClick={() =>
            onComplete({ sido: isAllRegions ? ALL_REGIONS_VALUE : sido, district })
          }
        >
          <div className="flex min-h-0 w-full flex-1 flex-col gap-[12px]">
            <h2 id={titleId} className="mt-[1.5px] text-h3-onboard text-background-500">
              어느 지역을 찾아보시겠어요?
            </h2>
            <div className="flex w-full gap-[12px]">
              <Select
                variant="L"
                value={sido}
                options={regionOptions}
                onChange={(value) => {
                  setSido(value);
                  setDistrict("");
                }}
                placeholder="시/도"
                ariaLabel="시/도 선택"
                className={selectClassName}
              />
              <Select
                variant="L"
                value={district}
                options={districtOptions}
                onChange={setDistrict}
                placeholder="시/군/구"
                ariaLabel="시/군/구 선택"
                disabled={shouldBlockDistrictSelect}
                className={selectClassName}
              />
            </div>
          </div>
        </OnboardBoxFrame>
      </div>
    </div>
  );
}
