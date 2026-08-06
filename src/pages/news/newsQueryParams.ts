import { ALL_CATEGORIES_VALUE, type NewsCategoryFilter } from "./components/NewsToolbar";
import { ALL_REGIONS_VALUE } from "./components/RegionOnboardingBox";
import type { NewsCategory, NewsSort, NewsStatus, NewsType } from "@/types/news";
import type { NewsTabValue } from "./components/NewsTabs";

export const newsTypeByTab: Record<NewsTabValue, NewsType> = {
  activity: "ACTIVITY",
  region: "LOCAL",
};

export const getInitialTab = (newsType: string | null): NewsTabValue =>
  newsType === "LOCAL" ? "region" : "activity";

export const isNewsSort = (value: string | null): value is NewsSort =>
  value === "VIEW" || value === "SCRAP";

export const isNewsCategory = (value: string | null): value is NewsCategory =>
  value === "LOCAL_NEWS" ||
  value === "LOCAL_POLICY" ||
  value === "RECRUITMENT_PARTICIPATION" ||
  value === "EDUCATION_SEMINAR" ||
  value === "BENEFIT_WELFARE_SERVICE" ||
  value === "INSTITUTION_NOTICE_NEWS";

export const isNewsStatus = (value: string | null): value is NewsStatus =>
  value === "RECRUITING" || value === "CLOSED" || value === "ALWAYS_OPEN" || value === "UPCOMING";

export const getQuerySort = (value: string | null): NewsSort | "" =>
  isNewsSort(value) ? value : "";

export const getQueryCategory = (value: string | null): NewsCategoryFilter =>
  value === ALL_CATEGORIES_VALUE || isNewsCategory(value) ? (value as NewsCategoryFilter) : "";

export const getQueryStatus = (value: string | null): NewsStatus | undefined =>
  isNewsStatus(value) ? value : undefined;

export const parseInitialRegion = (searchParams: URLSearchParams) => {
  const regionLevel1 = searchParams.get("regionLevel1")?.trim() || undefined;
  const regionLevel2 =
    regionLevel1 === ALL_REGIONS_VALUE
      ? undefined
      : searchParams.get("regionLevel2")?.trim() || undefined;
  const region =
    regionLevel1 === ALL_REGIONS_VALUE
      ? ALL_REGIONS_VALUE
      : [regionLevel1, regionLevel2].filter(Boolean).join(" ");

  return { regionLevel1, regionLevel2, region };
};
