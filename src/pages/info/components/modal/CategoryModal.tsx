import { useState } from "react";
import CloseModalFrame from "@/components/CloseModalFrame";
import CountButton from "../button/CountButton";
import InfoCategoryCard from "@/components/InfoCategoryCard";
import type { ParentCategory } from "@/types/info";

const categories: {
  type: ParentCategory;
  count: number;
}[] = [
  { type: "INSTITUTION", count: 235 },
  { type: "HOSPITAL", count: 235 },
  { type: "WELFARE", count: 235 },
  { type: "EMPLOYMENT", count: 235 },
  { type: "EDUCATION", count: 235 },
];

interface CategoryModalProps {
  category: ParentCategory;
  count: number;
  onClose: () => void;
  onSelect: (category: ParentCategory) => void;
}

export default function CategoryModal({
  category,
  count,
  onClose,
  onSelect,
}: CategoryModalProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ParentCategory | null>(null);

  if (!open) return null;

  const handleComplete = () => {
    if (!selectedCategory) return;
    onSelect(selectedCategory);
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