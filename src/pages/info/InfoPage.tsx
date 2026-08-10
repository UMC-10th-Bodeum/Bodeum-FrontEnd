import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoSubCategoryMap } from "@/constants/infoCategory";
import CategoryChips from "./components/CategoryChips";
import Pagination from "@/components/pagination/Pagination";
import InfoItem from "@/pages/info/components/InfoItem";
import CountButton from "./components/button/CountButton";
import LocationButton from "./components/button/LocationButton";
import { Select } from "@/components/Select";
import LocationModal from "./components/modal/LocationModal";
import CategoryModal from "./components/modal/CategoryModal";
import { useInfoListQuery } from "@/hooks/queries/info/useInfoListQuery";
import { useMyProfileQuery } from "@/hooks/queries/useMyProfileQuery";
import AsyncState from "@/components/AsyncState";

const PAGE_SIZE = 14;
const sortOptions = [
  { label: "조회순", value: "VIEW" },
  { label: "저장순", value: "SCRAP" },
  { label: "후기순", value: "REVIEW" },
];

export default function InfoPage() {
  const { data: profile } = useMyProfileQuery();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const subCategoryParam = searchParams.get("subCategory");
  const [subCategory, setSubCategory] = useState<number | null>(
    subCategoryParam ? Number(subCategoryParam) : null,
  );
  const [sort, setSort] = useState("");
  const navigate = useNavigate();
  
  const [regionLevel1, setRegionLevel1] = useState("");
  const [regionLevel2, setRegionLevel2] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const savedRegionLevel1 = sessionStorage.getItem(
      "info-region-level1",
    );
    const savedRegionLevel2 = sessionStorage.getItem(
      "info-region-level2",
    );

    // 사용자가 선택한 지역이 있으면 무조건 우선
    if (savedRegionLevel1 !== null) {
      setRegionLevel1(savedRegionLevel1);
      setRegionLevel2(savedRegionLevel2 ?? "");

      setLocation(
        savedRegionLevel1
          ? `${savedRegionLevel1} ${savedRegionLevel2 ?? ""}`.trim()
          : "지역 전체",
      );

      return;
    }

    // 로그인 상태인데 저장된 지역이 없으면 프로필 지역
    if (profile) {
      const level1 = profile.regionLevel1 ?? "";
      const level2 = profile.regionLevel2 ?? "";

      setRegionLevel1(level1);
      setRegionLevel2(level2);
      setLocation(`${level1} ${level2}`.trim());

      return;
    }

    // 비로그인
    setRegionLevel1("");
    setRegionLevel2("");
    setLocation("지역 전체");
  }, [profile]);
  
  const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  const categoryParam = searchParams.get("category");
  const parentCategory = (categoryParam && categoryParam in infoSubCategoryMap)
    ? (categoryParam as ParentCategory)
    : "INSTITUTION";
  
  const currentSubCategory = infoSubCategoryMap[parentCategory].find(
    (item) => item.id === subCategory,
  );

  const isRecommendation =
    currentSubCategory?.value.endsWith("_ETC") ?? false;
  
  const sortValue =
  sort === "VIEW"
    ? "viewCount,desc"
    : sort === "SCRAP"
      ? "scrapCount,desc"
      : "reviewCount,desc";

  const { data, isPending, isError } = useInfoListQuery({
    category: parentCategory,
    subCategory: subCategory ?? undefined,
    regionLevel1: regionLevel1 || null,
  regionLevel2: regionLevel2 || null,
    page: page - 1,
    size: PAGE_SIZE,
    sort: sortValue,
  });

  const items = data?.items.content ?? [];
  const totalPages = data?.items.totalPages ?? 0;
  const count = data?.items.totalElements ?? 0;

  const prevCategory = useRef(parentCategory);

  useEffect(() => {
    if (prevCategory.current !== parentCategory) {
      const subCategories = infoSubCategoryMap[parentCategory];
      setSubCategory(subCategories[0].id);
      prevCategory.current = parentCategory;
    }
  }, [parentCategory]);
  
  useEffect(() => {
    setPage(1);
  }, [subCategory, parentCategory, sort]);

  const moveToSubCategory = (id: number | null) => {
    setSubCategory(id);

    const params = new URLSearchParams({
      category: parentCategory,
    });

    if (id !== null) {
      params.set("subCategory", String(id));
    }

    navigate(`/info?${params.toString()}`, {
      replace: true,
    });
  };

  const moveToCategory = (category: ParentCategory) => {
    const params = new URLSearchParams({
      category,
    });

    const defaultSubCategory = infoSubCategoryMap[category][0].id;
    params.set("subCategory", String(defaultSubCategory));

    navigate(`/info?${params.toString()}`);
  };

  if (isPending) {
    return <AsyncState type="loading" />;
  }

  if (isError) {
    return <AsyncState type="error" />;
  }
  
  return (
    <div className="flex min-h-screen flex-col gap-[18px] bg-background-100 px-[32px] py-[20px]">
      
      <h2 className="text-h1-info -mb-[10px]">
        {profile?.nickname || "보호자"}님,
      </h2>
      <div className="flex gap-[10px] items-center">
        <LocationButton
          value={location}
          onClick={() => setLocationOpen(true)}
        />
        <CountButton
          category={parentCategory}
          count={count}
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
          onChange={moveToSubCategory}
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
      
      {isRecommendation && !profile ? (
        <div className="flex h-[200px] items-center justify-center text-background-500">
          로그인 / 회원가입 하고 추천 기능을 이용해 보세요!
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-background-500">
          조건에 맞는 정보가 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
            {items.map((item) => (
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
          onComplete={({ regionLevel1, regionLevel2 }) => {
            setRegionLevel1(regionLevel1 ?? "");
            setRegionLevel2(regionLevel2 ?? "");

            setLocation(
              regionLevel1
                ? `${regionLevel1} ${regionLevel2 ?? ""}`.trim()
                : "지역 전체",
            );

            sessionStorage.setItem(
              "info-region-level1",
              regionLevel1 ?? "",
            );
            sessionStorage.setItem(
              "info-region-level2",
              regionLevel2 ?? "",
            );

            setPage(1);
            setLocationOpen(false);
          }}
        />
      )}
      {categoryOpen && (
        <CategoryModal
          category={parentCategory}
          onClose={() => setCategoryOpen(false)}
          onSelect={(category) => {
            moveToCategory(category);
            setCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
};