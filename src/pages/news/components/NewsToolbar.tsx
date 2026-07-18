import LocationPinIcon from "@/assets/icons/LocationPin.svg?react";
import Input from "@/components/Input";
import { Select, type SelectOption } from "@/components/Select";
import type { NewsTabValue } from "./NewsTabs";

interface NewsToolbarProps {
  tab: NewsTabValue;
  keyword: string;
  onKeywordChange: (value: string) => void;
  selectedRegion: string;
  onSelectedRegionChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const sortOptions = [
  { label: "조회순", value: "views" },
  { label: "저장순", value: "saves" },
  { label: "후기순", value: "reviews" },
];

const categoryOptionsByTab: Record<NewsTabValue, SelectOption[]> = {
  activity: [
    { label: "카테고리", value: "all" },
    { label: "바우처 · 지원금", value: "voucher-subsidy" },
    { label: "모집 · 참여", value: "recruit-participation" },
    { label: "교육 · 세미나", value: "education-seminar" },
    { label: "혜택 · 복지서비스", value: "benefit-welfare-service" },
    { label: "기관 공지 · 뉴스", value: "institution-notice-news" },
  ],
  region: [
    { label: "카테고리", value: "all" },
    { label: "소식", value: "news" },
    { label: "정책", value: "policy" },
  ],
};

export default function NewsToolbar({
  tab,
  keyword,
  onKeywordChange,
  selectedRegion,
  onSelectedRegionChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
}: NewsToolbarProps) {
  const categoryOptions = categoryOptionsByTab[tab];
  const selectedRegionOptions = [{ label: selectedRegion, value: selectedRegion }];

  return (
    <div className="flex flex-wrap items-center gap-[12px]">
      <Input
        search
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        placeholder="소식을 검색해보세요"
        className="w-[640px]"
      />

      <Select
        options={selectedRegionOptions}
        value={selectedRegion}
        onChange={onSelectedRegionChange}
        ariaLabel="지역 선택"
        icon={<LocationPinIcon className="h-[16px] w-[16px] shrink-0 text-main-400" />}
        className="w-[137px]"
      />
      <Select
        options={sortOptions}
        value={sort}
        onChange={onSortChange}
        placeholder="조회순"
        ariaLabel="정렬 선택"
        className="w-[120px]"
      />
      <Select
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
        placeholder="카테고리"
        ariaLabel="카테고리 선택"
        className="w-[120px]"
      />
    </div>
  );
}
