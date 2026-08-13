import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type NewsCategoryFilter } from "../components/NewsToolbar";
import type { NewsTabValue } from "../components/NewsTabs";
import type { NewsSort, NewsStatus, NewsType } from "@/types/news";
import { hasStoredAuthSession } from "@/apis/authApi";
import {
  newsTypeByTab,
  getInitialTab,
  getQuerySort,
  getQueryCategory,
  getQueryStatus,
  getQueryPage,
  parseInitialRegion,
} from "../newsQueryParams";
import { useRegionFilter } from "./useRegionFilter";

export function useNewsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { regionLevel1: initialRegionLevel1, regionLevel2: initialRegionLevel2 } =
    parseInitialRegion(searchParams);
  const initialKeyword = searchParams.get("keyword")?.trim() ?? "";
  const hasAuthSession = hasStoredAuthSession();

  const [selectedTab, setSelectedTab] = useState<NewsTabValue>(() =>
    getInitialTab(searchParams.get("newsType")),
  );
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [sort, setSort] = useState<NewsSort | "">(() => getQuerySort(searchParams.get("sort")));
  const [category, setCategory] = useState<NewsCategoryFilter>(() =>
    getQueryCategory(searchParams.get("category")),
  );
  const [status, setStatus] = useState<NewsStatus | undefined>(() =>
    getQueryStatus(searchParams.get("status")),
  );
  const [page, setPage] = useState(() => getQueryPage(searchParams.get("page")));

  const updateNewsSearchParams = ({
    nextNewsType = newsTypeByTab[selectedTab],
    nextRegionLevel1,
    nextRegionLevel2,
    nextSort = sort,
    nextCategory,
    nextKeyword = searchKeyword,
    nextStatus = status,
    nextPage = page,
  }: {
    nextNewsType?: NewsType;
    nextRegionLevel1?: string | null;
    nextRegionLevel2?: string | null;
    nextSort?: NewsSort | "";
    nextCategory?: NewsCategoryFilter | null;
    nextKeyword?: string;
    nextStatus?: NewsStatus;
    nextPage?: number;
  }) => {
    const params = new URLSearchParams();
    params.set("newsType", nextNewsType);

    const resolvedRegionLevel1 =
      nextRegionLevel1 === undefined ? region.regionLevel1 : (nextRegionLevel1 ?? undefined);
    const resolvedRegionLevel2 =
      nextRegionLevel2 === undefined ? region.regionLevel2 : (nextRegionLevel2 ?? undefined);
    const resolvedCategory = nextCategory === undefined ? category : (nextCategory ?? undefined);

    if (resolvedRegionLevel1) {
      params.set("regionLevel1", resolvedRegionLevel1);
    }
    if (resolvedRegionLevel2) {
      params.set("regionLevel2", resolvedRegionLevel2);
    }
    if (nextSort) {
      params.set("sort", nextSort);
    }
    if (nextStatus) {
      params.set("status", nextStatus);
    }
    if (resolvedCategory) {
      params.set("category", resolvedCategory);
    }
    if (nextKeyword) {
      params.set("keyword", nextKeyword);
    }
    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  };

  const region = useRegionFilter({
    initialRegionLevel1,
    initialRegionLevel2,
    hasAuthSession,
    onCommit: ({ regionLevel1, regionLevel2 }) => {
      setPage(1);
      updateNewsSearchParams({
        nextRegionLevel1: regionLevel1,
        nextRegionLevel2: regionLevel2,
        nextPage: 1,
      });
    },
  });

  const selectTab = (value: NewsTabValue) => {
    setSelectedTab(value);
    setCategory("");
    setPage(1);
    updateNewsSearchParams({
      nextNewsType: newsTypeByTab[value],
      nextCategory: null,
      nextPage: 1,
    });
  };

  const changeSort = (value: NewsSort) => {
    setSort(value);
    setPage(1);
    updateNewsSearchParams({ nextSort: value, nextPage: 1 });
  };

  const changeCategory = (value: NewsCategoryFilter) => {
    setCategory(value);
    setPage(1);
    updateNewsSearchParams({ nextCategory: value || null, nextPage: 1 });
  };

  const search = (nextKeyword: string) => {
    const normalizedKeyword = nextKeyword.trim();
    setKeyword(normalizedKeyword);
    setSearchKeyword(normalizedKeyword);
    setPage(1);
    updateNewsSearchParams({ nextKeyword: normalizedKeyword, nextPage: 1 });
  };

  const onKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const changePage = (nextPage: number) => {
    const normalizedPage = Number.isSafeInteger(nextPage) && nextPage >= 1 ? nextPage : 1;
    setPage(normalizedPage);
    updateNewsSearchParams({ nextPage: normalizedPage });
  };

  useEffect(() => {
    const nextTab = getInitialTab(searchParams.get("newsType"));
    const nextSort = getQuerySort(searchParams.get("sort"));
    const nextCategory = getQueryCategory(searchParams.get("category"));
    const nextStatus = getQueryStatus(searchParams.get("status"));
    const nextKeyword = searchParams.get("keyword")?.trim() ?? "";
    const nextPage = getQueryPage(searchParams.get("page"));

    setSelectedTab(nextTab);
    setSort(nextSort);
    setCategory(nextCategory);
    setStatus(nextStatus);
    setKeyword(nextKeyword);
    setSearchKeyword(nextKeyword);
    setPage(nextPage);
  }, [searchParams]);

  return {
    tab: selectedTab,
    selectTab,
    newsType: newsTypeByTab[selectedTab],
    keyword,
    searchKeyword,
    search,
    onKeywordChange,
    sort,
    setSort: changeSort,
    category,
    setCategory: changeCategory,
    status,
    page,
    setPage: changePage,
    region,
  };
}
