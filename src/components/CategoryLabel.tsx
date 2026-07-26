import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

interface CategoryLabelProps {
  category: ParentCategory;
}

export default function CategoryLabel({
  category,
}: CategoryLabelProps) {
  const { label, bgColor, textColor } = infoCategoryMap[category];

  return (
    <span
      className={`shrink-0 rounded-[10px] ${bgColor} px-2 py-[5px] text-h5-list leading-none ${textColor}`}
    >
      {label}
    </span>
  );
}