import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoSubCategoryMap } from "@/constants/infoCategory";
import CategoryChips from "./components/CategoryChips";
import Pagination from "@/components/pagination/Pagination";
import InfoItem from "@/pages/info/components/InfoItem";
import { infoMockData } from "@/mocks/info";
import CountButton from "./components/button/CountButton";
import LocationButton from "./components/button/LocationButton";
import { Select } from "@/components/Select";
import LocationModal from "./components/modal/LocationModal";
import CategoryModal from "./components/modal/CategoryModal";

const PAGE_SIZE = 14;
const sortOptions = [
  { label: "조회순", value: "VIEW" },
  { label: "저장순", value: "SCRAP" },
  { label: "후기순", value: "REVIEW" },
];

export default function InfoPage() {
  const items = infoMockData.items.content;
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("VIEW");
  const navigate = useNavigate();
  
  const [location, setLocation] = useState("경기도 수원시");
  const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  
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
  return items.filter(
    (item) =>
      item.mainCategory === parentCategory &&
      (!subCategory || item.subCategory === subCategory)
  );
}, [items, parentCategory, subCategory]);

const currentItems = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  return filteredItems.slice(start, start + PAGE_SIZE);
}, [filteredItems, page]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  // const totalPages = data.result.items.totalPages; (api 연동시)
  
  useEffect(() => {
    setPage(1);
  }, [subCategory]);
  
  return (
    <div className="flex min-h-screen flex-col gap-[18px] bg-background-100 px-[32px] py-[20px]">
      
      <h2 className="text-h1-info -mb-[10px]">
        NN님,
      </h2>
      <div className="flex gap-[10px] items-center">
        <LocationButton
          value={location}
          onClick={() => setLocationOpen(true)}
        />
        <CountButton
          category={parentCategory}
          count={235}
          onClick={() => setCategoryOpen(true)}
        />
        <h2 className="text-h1-info">
          의 정보를 모았어요
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <CategoryChips
          parentCategory={parentCategory}
          subCategory={subCategory}
          onChange={setSubCategory}
        />
        <Select
          options={sortOptions}
          value={sort}
          onChange={setSort}
          placeholder="조회순"
          variant="S"
          className="w-[120px]"
        />
      </div>
      
      {currentItems.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-background-500">
          조건에 맞는 정보가 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
            {currentItems.map((item) => (
              <InfoItem
                key={item.infoItemId}
                {...item}
                onClick={() => navigate(`/info/${item.mainCategory}/${item.infoItemId}`)}
                onScrapClick={() => console.log(item.infoItemId)}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}

      {locationOpen && (
        <LocationModal
          location={location}
          onClose={() => setLocationOpen(false)}
          onComplete={(location) => {
            setLocation(location);
            setLocationOpen(false);
          }}
        />
      )}
      {categoryOpen && (
        <CategoryModal
          category={parentCategory}
          count={filteredItems.length}
          onClose={() => setCategoryOpen(false)}
          onSelect={(category) => {
            navigate(`/info?category=${category}`);
            setCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
};