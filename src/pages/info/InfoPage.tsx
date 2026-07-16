import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoSubCategoryMap } from "@/constants/infoCategory";
import CategoryChips from "./components/CategoryChips";

export default function InfoPage() {
  const [searchParams] = useSearchParams();
  
  const categoryParam = searchParams.get("category");
  const parentCategory = (categoryParam && categoryParam in infoSubCategoryMap)
    ? (categoryParam as ParentCategory)
    : "INSTITUTION";
  const [subCategory, setSubCategory] = useState<string | null>(null);

  useEffect(() => {
    const subCategories = infoSubCategoryMap[parentCategory];
    if (subCategories && subCategories.length > 0) {
      setSubCategory(subCategories[0].value);
    }
  }, [parentCategory]);
  
  return (
    <div className="flex min-h-screen flex-col gap-[18px] bg-background-100 px-[32px] py-[20px]">
      <CategoryChips
        parentCategory={parentCategory}
        subCategory={subCategory}
        onChange={setSubCategory}
      />
    </div>
  );
};