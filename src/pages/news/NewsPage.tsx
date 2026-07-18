import { useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import RecommendedNewsTopSection from "./components/RecommendedNewsTopSection";
import NewsTabs, { type NewsTabValue } from "./components/NewsTabs";
import NewsToolbar from "./components/NewsToolbar";
import NewsListSection from "./components/NewsListSection";
import type { NewsListItem } from "./components/NewsListSection";

const news = [
  {
    id: 1,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 2,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 3,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 4,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 5,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
];

const newsListItems: NewsListItem[] = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  type: "PROGRAM",
  name: "드림발달클리닉",
  address: "경기 수원시",
  services: ["호매실장애인종합복지관"],
  chipVariant: "recruit",
  chipText: "상시모집",
  viewCount: 1204,
  scrapCount: 1204,
  isScrapped: false,
}));

export default function NewsPage() {
  const [selectedTab, setSelectedTab] = useState<NewsTabValue>("activity");
  const [keyword, setKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("서울시 강남구");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

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
            onKeywordChange={setKeyword}
            selectedRegion={selectedRegion}
            onSelectedRegionChange={setSelectedRegion}
            sort={sort}
            onSortChange={setSort}
            category={category}
            onCategoryChange={setCategory}
          />
          <NewsListSection items={newsListItems} />
          <nav aria-label="뉴스 페이지네이션" className="p-2 mb-[21.2px]">
            <Pagination currentPage={page} totalPages={120} onChange={setPage} />
          </nav>
        </div>
      </div>
    </main>
  );
}
