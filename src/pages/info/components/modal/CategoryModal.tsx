import { useState } from "react";
import CloseModalFrame from "@/components/CloseModalFrame";
import CountButton from "../button/CountButton";
import InfoCategoryCard from "@/components/InfoCategoryCard";
import type { ParentCategory } from "@/types/info";

interface CategoryModalProps {
  category: ParentCategory;
  count: number;
  counts?: {
    institution: number;
    hospital: number;
    welfare: number;
    employment: number;
    education: number;
  };
  onClose: () => void;
  onSelect: (category: ParentCategory) => void;
}

export default function CategoryModal({
  category,
  count,
  counts,
  onClose,
  onSelect,
}: CategoryModalProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ParentCategory | null>(null);

  const handleComplete = () => {
    if (!selectedCategory) return;
    onSelect(selectedCategory);
  };

  const categories = [
    {
      type: "INSTITUTION" as const,
      count: counts?.institution ?? 0,
    },
    {
      type: "HOSPITAL" as const,
      count: counts?.hospital ?? 0,
    },
    {
      type: "WELFARE" as const,
      count: counts?.welfare ?? 0,
    },
    {
      type: "EMPLOYMENT" as const,
      count: counts?.employment ?? 0,
    },
    {
      type: "EDUCATION" as const,
      count: counts?.education ?? 0,
    },
  ];

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
          count={count}
          variant="display"
        />
        </div>
        
        <span className="text-h3-onboard text-background-500 pb-[12px]">
          어느 정보를 찾아보시겠어요?
        </span>

        <div className="grid grid-cols-3 gap-x-[40px] gap-y-[20px] pb-[110px]">
          {categories.map(({ type, count }) => (
            <InfoCategoryCard
              key={type}
              type={type}
              count={count}
              selected={selectedCategory === type}
              onClick={() => setSelectedCategory(type)}
            />
          ))}
        </div>
      </div>
    </CloseModalFrame>
  );
}