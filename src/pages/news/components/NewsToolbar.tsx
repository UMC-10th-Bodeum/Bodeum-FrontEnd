import LocationPinIcon from "@/assets/icons/LocationPin.svg?react";
import ChevronLeft from "@/assets/icons/ChevronLeft.svg?react";
import Input from "@/components/Input";
import { Select, type SelectOption } from "@/components/Select";
import type { NewsTabValue } from "./NewsTabs";
import { searchSuggestionMockData } from "@/mocks/search";

interface NewsToolbarProps {
  tab: NewsTabValue;
  keyword: string;
  onKeywordChange: (value: string) => void;
  selectedRegion: string;
  onSelectedRegionClick: () => void;
  sort: string;
  onSortChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onSearch: (keyword: string) => void;
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
  onSelectedRegionClick,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  onSearch,
}: NewsToolbarProps) {
  const categoryOptions = categoryOptionsByTab[tab];
  const selectedRegionLabel = selectedRegion || "전체 지역";
  const selectedRegionButtonStateClass = selectedRegion
    ? "border-main-400 text-background-600"
    : "border-background-250 text-background-500";
  
  const suggestions =
    keyword.trim().length >= 2
      ? searchSuggestionMockData.result.suggestions.filter((item) =>
        item.text.includes(keyword)
      )
      : [];
  
  return (
    <div className="flex flex-wrap items-center gap-[12px]">
      <Input
        search
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        suggestions={suggestions}
        onSuggestionClick={(text) => {
          onKeywordChange(text);
        }}
        onEnter={onSearch}
        placeholder="소식을 검색해보세요"
        className="w-[640px]"
      />

      <button
        type="button"
        onClick={onSelectedRegionClick}
        aria-label={`지역 선택: ${selectedRegionLabel}`}
        className={`flex h-[34px] w-[137px] cursor-pointer items-center justify-between gap-3 rounded-[8px] border bg-background-100 py-2 pr-2 pl-3 text-left text-h6-list transition-colors hover:border-background-300 hover:text-background-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background-600 ${selectedRegionButtonStateClass}`}
      >
        <span className="flex min-w-0 items-center gap-0.5">
          <LocationPinIcon className="h-[16px] w-[16px] shrink-0 text-main-400" />
          <span className="min-w-0">{selectedRegionLabel}</span>
        </span>
        <ChevronLeft className="shrink-0 -rotate-90 text-background-500" aria-hidden />
      </button>
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
