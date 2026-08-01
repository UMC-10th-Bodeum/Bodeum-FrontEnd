import { useState } from "react";
import CloseModalFrame from "@/components/CloseModalFrame";
import LocationButton from "../button/LocationButton";
import { Select } from "@/components/Select";
import { districtOptionsByRegion, regionOptions } from "@/constants/regions";

interface LocationModalProps {
  location: string;
  onClose: () => void;
  onComplete: (location: {
    regionLevel1: string;
    regionLevel2: string;
  }) => void;
}

export default function LocationModal({
  location,
  onClose,
  onComplete,
}: LocationModalProps) {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const handleComplete = () => {
    onComplete({
      regionLevel1: province,
      regionLevel2: city,
    });
  };

  const districtOptions = province
  ? districtOptionsByRegion[province] ?? []
    : [];
  
  const isCompleteDisabled = !province || !city;

  return (
    <CloseModalFrame
      leftButtonText="나가기"
      rightButtonText="완료"
      onClose={onClose}
      onLeftButtonClick={onClose}
      onRightButtonClick={handleComplete}
      rightButtonDisabled={isCompleteDisabled}
    >
      <div className="flex flex-col">
        <div className="pb-[20px]">
          <LocationButton
            disabled
            value={location}
          />
        </div>

        <span className="text-h3-onboard text-background-500 pb-[12px]">어느 지역을 찾아보시겠어요?</span>
        <div className="flex gap-5 pb-[192px]">
          <Select
            options={regionOptions}
            value={province}
            onChange={(value) => {
              setProvince(value);
              setCity("");
            }}
            placeholder="시/도"
            variant="L"
            className="w-[262px]"
          />

          <Select
            options={districtOptions}
            value={city}
            onChange={setCity}
            placeholder="시/군/구"
            variant="L"
            className="w-[262px]"
            disabled={!province}
          />
        </div>
      </div>
    </CloseModalFrame>
  );
}