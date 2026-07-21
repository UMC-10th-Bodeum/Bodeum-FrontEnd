import ChevronDownIcon from "@/assets/icons/ChevronDown.svg?react";
import FilterButton from "./FilterButton";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

interface CountButtonProps {
  category: ParentCategory;
  count: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function CountButton({
  category,
  count,
  disabled = false,
  onClick,
}: CountButtonProps) {
  const { label, buttonClass } = infoCategoryMap[category];

  return (
    <FilterButton
      variant="category"
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
    >
      <span className="text-h3-heading">
        {label} +{count}
      </span>

      {!disabled && <ChevronDownIcon />}
    </FilterButton>
  );
}