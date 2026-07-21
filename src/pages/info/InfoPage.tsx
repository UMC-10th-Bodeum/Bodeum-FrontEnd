import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoSubCategoryMap } from "@/constants/infoCategory";
import CategoryChips from "./components/CategoryChips";
import Pagination from "@/components/pagination/Pagination";
import InfoItem from "@/components/InfoItem";
import { infoMockData } from "@/mocks/info";

const PAGE_SIZE = 14;

export default function InfoPage() {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
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

  const filteredItems = useMemo(() => {
  return infoMockData.filter(
    (item) =>
      item.type === parentCategory &&
      (!subCategory || item.subCategory === subCategory)
  );
}, [parentCategory, subCategory]);

const currentItems = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  return filteredItems.slice(start, start + PAGE_SIZE);
}, [filteredItems, page]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  
  useEffect(() => {
    setPage(1);
  }, [subCategory]);
  
  return (
    <div className="flex min-h-screen flex-col gap-[18px] bg-background-100 px-[32px] py-[20px]">
      <CategoryChips
        parentCategory={parentCategory}
        subCategory={subCategory}
        onChange={setSubCategory}
      />

      <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
        {currentItems.map((item) => (
          <InfoItem
            key={item.id}
            {...item}
            onClick={() => navigate(`/info/${item.type}/${item.id}`)}
            onScrapClick={() => console.log(item.id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
};