import CategoryButton from "@/components/button/CategoryButton";
import {
  infoCategoryMap,
  infoSubCategoryMap,
} from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import AwardIcon from "@/assets/icons/Award.svg?react";

interface CategoryChipsProps {
  parentCategory: ParentCategory;
  subCategory: number | null;
  onChange: (subCategory: number | null) => void;
}

export default function CategoryChips({
  parentCategory,
  subCategory,
  onChange,
}: CategoryChipsProps) {
  const categories = infoSubCategoryMap[parentCategory];

  const visibleCategories = categories.filter(
    (item) =>
      item.value !== "YOUTH_CENTER" &&
      item.value !== "KEAD_JOB" &&
      item.value !== "GENERAL_HOSPITAL" ,
  );

  return (
    <div className="flex flex-wrap gap-2">
      {visibleCategories
        .filter((item) => item.value.endsWith("_ETC"))
        .map((item) => (
          <CategoryButton
            key={item.id}
            category={parentCategory}
            label={item.label}
            icon={AwardIcon}
            selected={subCategory === item.id}
            onClick={() => onChange(item.id)}
          />
        ))}

      <CategoryButton
        category={parentCategory}
        label={`${infoCategoryMap[parentCategory].label} 전체`}
        selected={subCategory === null}
        onClick={() => onChange(null)}
      />

      {visibleCategories
        .filter((item) => !item.value.endsWith("_ETC"))
        .map((item) => (
          <CategoryButton
            key={item.id}
            category={parentCategory}
            label={item.label}
            selected={subCategory === item.id}
            onClick={() => onChange(item.id)}
          />
        ))}
    </div>
  );
}