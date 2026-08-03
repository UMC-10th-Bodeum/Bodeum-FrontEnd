import { useState } from "react";
import CloseModalFrame from "@/components/CloseModalFrame";
import CountButton from "../button/CountButton";
import InfoCategoryCard from "@/components/InfoCategoryCard";
import type { ParentCategory } from "@/types/info";
import { useInfoItemCounts } from "@/hooks/useHome";

interface CategoryModalProps {
  category: ParentCategory;
  onClose: () => void;
  onSelect: (category: ParentCategory) => void;
}

const categoryTypes: ParentCategory[] = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
];

export default function CategoryModal({
  category,
  onClose,
  onSelect,
}: CategoryModalProps) {
  const { data: counts } = useInfoItemCounts();
  const [selectedCategory, setSelectedCategory] =
    useState<ParentCategory | null>(null);

  const handleComplete = () => {
    if (!selectedCategory) return;
    onSelect(selectedCategory);
  };

  const categoryCounts: Record<ParentCategory, number> = {
    INSTITUTION: counts?.institution ?? 0,
    HOSPITAL: counts?.hospital ?? 0,
    WELFARE: counts?.welfare ?? 0,
    EMPLOYMENT: counts?.employment ?? 0,
    EDUCATION: counts?.education ?? 0,
  };

  return (
    <CloseModalFrame
      leftButtonText="나가기"
      rightButtonText="완료"
      onClose={onClose}
      onLeftButtonClick={onClose}
      onRightButtonClick={handleComplete}
      rightButtonDisabled={!selectedCategory}
      className="w-[624px]"
    >
      <div className="flex flex-col">
        <div className="pb-[20px]">
          <CountButton
            category={category}
            count={categoryCounts[category]}
            variant="display"
          />
        </div>
        
        <span className="text-h3-onboard text-background-500 pb-[12px]">
          어느 정보를 찾아보시겠어요?
        </span>

        <div className="grid grid-cols-3 gap-x-[40px] gap-y-[20px] pb-[110px]">
          {categoryTypes.map((type) => (
            <InfoCategoryCard
              key={type}
              type={type}
              count={categoryCounts[type]}
              selected={selectedCategory === type}
              onClick={() => setSelectedCategory(type)}
            />
          ))}
        </div>
      </div>
    </CloseModalFrame>
  );
}