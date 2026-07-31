import { useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import RecommendedNewsTopSection from "./components/RecommendedNewsTopSection";
import NewsTabs, { type NewsTabValue } from "./components/NewsTabs";
import NewsToolbar from "./components/NewsToolbar";
import NewsListSection from "./components/NewsListSection";
import RegionOnboardingBox from "./components/RegionOnboardingBox";
import { formatRegionDisplayLabel } from "@/constants/regions";
import { newsListItems } from "./data/newsMockData";

const news = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: "2026 발달재활서비스 바우처 신청 안내",
  region: "서울",
  category: "강남구",
  dDay: 21,
  views: 1204,
}));

export default function NewsPage() {
  const [selectedTab, setSelectedTab] = useState<NewsTabValue>("activity");
  const [keyword, setKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showRegionOnboarding, setShowRegionOnboarding] = useState(false);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const openRegionOnboarding = () => {
    setShowRegionOnboarding(true);
  };

  const completeRegionOnboarding = (region: string) => {
    setSelectedRegion(formatRegionDisplayLabel(region));
    setShowRegionOnboarding(false);
  };

  const handleSearch = (keyword: string) => {
    console.log("검색:", keyword);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background-100">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[18px] px-[32px] py-[20px]">
        <div className="py-[20px]">
          <RecommendedNewsTopSection news={news} />
        </div>

        <div className="flex flex-col gap-[16px]">
          <NewsTabs
            value={selectedTab}
            onChange={(value) => {
              setSelectedTab(value);
              setCategory("");
              setPage(1);
            }}
          />
          <NewsToolbar
            tab={selectedTab}
            keyword={keyword}
            onSearch={handleSearch}
            onKeywordChange={setKeyword}
            selectedRegion={selectedRegion}
            onSelectedRegionClick={openRegionOnboarding}
            sort={sort}
            onSortChange={setSort}
            category={category}
            onCategoryChange={setCategory}
          />
          <NewsListSection items={newsListItems} sourceTab={selectedTab} />
          <nav aria-label="소식 페이지네이션" className="p-2 mb-[21.2px]">
            <Pagination currentPage={page} totalPages={120} onChange={setPage} />
          </nav>
        </div>
      </div>
      {showRegionOnboarding && (
        <RegionOnboardingBox
          onClose={() => setShowRegionOnboarding(false)}
          onComplete={completeRegionOnboarding}
        />
      )}
    </main>
  );
}
