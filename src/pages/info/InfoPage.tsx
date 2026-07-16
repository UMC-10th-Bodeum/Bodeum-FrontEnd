import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import CategoryChips from "./components/categoryChips";
import { infoSubCategoryMap } from "@/constants/infoCategory";

export default function InfoPage() {
  const [searchParams] = useSearchParams();

  const parentCategory =
    (searchParams.get("category") as ParentCategory) ?? "INSTITUTION";

  const [subCategory, setSubCategory] = useState<string | null>(null);

  useEffect(() => {
    setSubCategory(infoSubCategoryMap[parentCategory][0].value);
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
}