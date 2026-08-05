export type NewsSort = "VIEW" | "SCRAP";

export type NewsCategory =
  | "LOCAL_NEWS"
  | "LOCAL_POLICY"
  | "VOUCHER_SUBSIDY"
  | "RECRUITMENT_PARTICIPATION"
  | "EDUCATION_SEMINAR"
  | "BENEFIT_WELFARE_SERVICE"
  | "INSTITUTION_NOTICE_NEWS";

export type NewsStatus = "RECRUITING" | "CLOSED" | "ALWAYS_OPEN" | "UPCOMING";

export type NewsType = "LOCAL" | "ACTIVITY";

export interface NewsListParams {
  page?: number;
  size?: number;
  sort?: NewsSort;
  newsType?: NewsType;
  regionId?: number;
  regionLevel1?: string;
  regionLevel2?: string;
  category?: NewsCategory;
  status?: NewsStatus;
}

export interface NewsSearchParams extends NewsListParams {
  keyword: string;
}

export interface NewsListItem {
  newsId: number;
  title: string;
  summary: string;
  region: string | null;
  categoryCode: NewsCategory;
  categoryLabel: string;
  status: NewsStatus | null;
  sourceName: string | null;
  publishedAt: string;
  applyEndDate: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  scrapCount: number;
}

export interface NewsListResult {
  items: NewsListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface NewsListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NewsListResult;
}

export interface NewsDetail {
  newsId: number;
  title: string;
  summary: string;
  content: string;
  region: string | null;
  categoryCode: NewsCategory;
  categoryLabel: string;
  sourceName: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  newsType: NewsType;
  status: NewsStatus | null;
  targetAudience: string;
  contact: string;
  manager: string;
  publishedAt: string;
  programStartDate: string;
  programEndDate: string;
  applyStartDate: string;
  applyEndDate: string;
  viewCount: number;
  scrapCount: number;
  scrapped: boolean;
}

export interface NewsDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NewsDetail;
}

export interface RelatedNews {
  newsId: number;
  region: string;
  title: string;
  scrapCount: number;
  viewCount: number;
}

export interface RelatedNewsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RelatedNews[];
}

export interface NewsScrapResult {
  newsId: number;
  scrapped: boolean;
  scrapCount: number;
}

export interface NewsScrapResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NewsScrapResult;
}
