import LocationPinIcon from "@/assets/icons/LocationPin.svg?react";
import ChevronLeft from "@/assets/icons/ChevronLeft.svg?react";
import Input from "@/components/Input";
import { Select, type SelectOption } from "@/components/Select";
import type { NewsTabValue } from "./NewsTabs";
import type { NewsCategory, NewsSort } from "@/types/news";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNewsSearchSuggestions } from "@/hooks/useNews";
import { ALL_REGIONS_LABEL } from "./RegionOnboardingBox";

export const ALL_CATEGORIES_VALUE = "ALL";
export type NewsCategoryFilter = NewsCategory | typeof ALL_CATEGORIES_VALUE | "";

interface NewsToolbarProps {
  tab: NewsTabValue;
  keyword: string;
  onKeywordChange: (value: string) => void;
  selectedRegion: string;
  onSelectedRegionClick: () => void;
  sort: NewsSort | "";
  onSortChange: (value: NewsSort) => void;
  category: NewsCategoryFilter;
  onCategoryChange: (value: NewsCategoryFilter) => void;
  onSearch: (keyword: string) => void;
}

const sortOptions = [
  { label: "조회순", value: "VIEW" },
  { label: "저장순", value: "SCRAP" },
];

const categoryOptionsByTab: Record<NewsTabValue, SelectOption[]> = {
  activity: [
    { label: "전체", value: ALL_CATEGORIES_VALUE },
    { label: "모집 · 참여", value: "RECRUITMENT_PARTICIPATION" },
    { label: "교육 · 세미나", value: "EDUCATION_SEMINAR" },
    { label: "혜택 · 복지서비스", value: "BENEFIT_WELFARE_SERVICE" },
    { label: "기관 공지 · 뉴스", value: "INSTITUTION_NOTICE_NEWS" },
  ],
  region: [
    { label: "전체", value: ALL_CATEGORIES_VALUE },
    { label: "소식", value: "LOCAL_NEWS" },
    { label: "정책", value: "LOCAL_POLICY" },
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
  const selectedRegionLabel = selectedRegion || ALL_REGIONS_LABEL;
  const selectedRegionButtonStateClass = selectedRegion
    ? "border-main-400 text-background-600"
    : "border-background-250 text-background-500";

  const normalizedKeyword = keyword.trim();
  const debouncedKeyword = useDebouncedValue(normalizedKeyword, 300);
  const { data: suggestions = [], isPending: areSuggestionsPending } =
    useNewsSearchSuggestions(debouncedKeyword);
  const areSuggestionsLoading =
    normalizedKeyword.length >= 2 &&
    (normalizedKeyword !== debouncedKeyword || areSuggestionsPending);

  return (
    <div className="flex flex-wrap items-center gap-[12px]">
      <Input
        search
        searchType="news"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onClear={() => onSearch("")}
        suggestions={suggestions}
        suggestionsLoading={areSuggestionsLoading}
        onSuggestionClick={(text) => {
          onKeywordChange(text);
          onSearch(text);
        }}
        onEnter={onSearch}
        placeholder="소식을 검색해보세요"
        className="w-[640px]"
      />

      <button
        type="button"
        onClick={onSelectedRegionClick}
        aria-label={`지역 선택: ${selectedRegionLabel}`}
        className={`flex h-[34px] w-[147px] cursor-pointer items-center justify-between gap-3 rounded-[8px] border bg-background-100 py-2 pr-2 pl-3 text-left text-h6-list transition-colors hover:border-background-300 hover:text-background-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background-600 ${selectedRegionButtonStateClass}`}
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
        onChange={(value) => onSortChange(value as NewsSort)}
        placeholder="조회순"
        ariaLabel="정렬 선택"
        className="w-[138px]"
      />
      <Select
        options={categoryOptions}
        value={category}
        onChange={(value) => onCategoryChange(value as NewsCategoryFilter)}
        placeholder="카테고리"
        ariaLabel="카테고리 선택"
        className="w-[138px]"
      />
    </div>
  );
}
