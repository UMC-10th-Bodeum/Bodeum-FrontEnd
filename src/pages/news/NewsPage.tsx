import Pagination from "@/components/pagination/Pagination";
import RecommendedNewsTopSection from "./components/RecommendedNewsTopSection";
import NewsTabs from "./components/NewsTabs";
import NewsToolbar, { ALL_CATEGORIES_VALUE } from "./components/NewsToolbar";
import NewsListSection from "./components/NewsListSection";
import RegionOnboardingBox from "./components/RegionOnboardingBox";
import { useNews, useNewsSearch } from "@/hooks/useNews";
import type { NewsListParams } from "@/types/news";
import { useNewsFilters } from "./hooks/useNewsFilters";
import AsyncState from "@/components/AsyncState";

const PAGE_SIZE = 14;

export default function NewsPage() {
  const filters = useNewsFilters();
  const { region } = filters;

  const listParams: NewsListParams = {
    page: filters.page - 1,
    size: PAGE_SIZE,
    sort: filters.sort || "VIEW",
    newsType: filters.newsType,
    regionId: region.regionId,
    regionLevel1:
      region.regionId === undefined && !region.isAllRegionsSelected
        ? region.regionLevel1
        : undefined,
    category:
      filters.category === "" || filters.category === ALL_CATEGORIES_VALUE
        ? undefined
        : filters.category,
    status: filters.status,
  };

  const hasSearchKeyword = filters.searchKeyword.length > 0;
  const newsQuery = useNews(listParams, !hasSearchKeyword && !region.isRegionInitializing);
  const newsSearchQuery = useNewsSearch(
    { ...listParams, keyword: filters.searchKeyword },
    hasSearchKeyword && !region.isRegionInitializing,
  );
  const { data, isPending, isError } = hasSearchKeyword ? newsSearchQuery : newsQuery;

  if (isPending) {
    return <AsyncState type="loading" />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background-100">
      <div className="flex flex-col gap-[18px] px-[32px] py-[20px]">
        <RecommendedNewsTopSection />

        <div className="flex flex-col gap-[16px]">
          <NewsTabs value={filters.tab} onChange={filters.selectTab} />
          <NewsToolbar
            tab={filters.tab}
            keyword={filters.keyword}
            onSearch={filters.search}
            onKeywordChange={filters.onKeywordChange}
            selectedRegion={region.selectedRegion}
            onSelectedRegionClick={region.openRegionOnboarding}
            sort={filters.sort}
            onSortChange={filters.setSort}
            category={filters.category}
            onCategoryChange={filters.setCategory}
          />
          <NewsListSection items={data?.items ?? []} isError={isError} />
          {(data?.totalPages ?? 0) > 0 && (
            <nav aria-label="소식 페이지네이션" className="p-2">
              <Pagination
                currentPage={filters.page}
                totalPages={data?.totalPages ?? 1}
                onChange={filters.setPage}
              />
            </nav>
          )}
        </div>
      </div>
      {region.showRegionOnboarding && (
        <RegionOnboardingBox
          onClose={region.closeRegionOnboarding}
          onComplete={region.completeRegionOnboarding}
        />
      )}
    </main>
  );
}
