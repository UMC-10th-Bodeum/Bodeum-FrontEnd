import CategoryButton from "@/components/CategoryButton";
import {
  infoCategoryMap,
  infoSubCategoryMap,
} from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import AwardIcon from "@/assets/icons/Award.svg?react";

interface CategoryChipsProps {
  parentCategory: ParentCategory;
  subCategory: string | null;
  onChange: (subCategory: string | null) => void;
}

export default function CategoryChips({
  parentCategory,
  subCategory,
  onChange,
}: CategoryChipsProps) {
  const categories = infoSubCategoryMap[parentCategory];

  return (
    <div className="flex flex-wrap gap-2">
      {categories
        .filter((item) => item.value.endsWith("_ETC"))
        .map((item) => (
          <CategoryButton
            key={item.id}
            category={parentCategory}
            label={item.label}
            icon={AwardIcon}
            selected={subCategory === item.value}
            onClick={() => onChange(item.value)}
          />
        ))}

      <CategoryButton
        category={parentCategory}
        label={`${infoCategoryMap[parentCategory].label} 전체`}
        selected={subCategory === null}
        onClick={() => onChange(null)}
      />

      {categories
        .filter((item) => !item.value.endsWith("_ETC"))
        .map((item) => (
          <CategoryButton
            key={item.id}
            category={parentCategory}
            label={item.label}
            selected={subCategory === item.value}
            onClick={() => onChange(item.value)}
          />
        ))}
    </div>
  );
}