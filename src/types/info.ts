export type ParentCategory =
  | "INSTITUTION"
  | "HOSPITAL"
  | "WELFARE"
  | "EMPLOYMENT"
  | "EDUCATION";

export interface InfoSubCategory {
  id?: number;
  value: string;
  label: string;
}

export interface Category {
  id: number;
  parent_category: ParentCategory;
  parent_category_ko: string;
  sub_category: string;
  sub_category_ko: string;
}

export interface InfoItemResponse {
  infoItemId: number;
  name: string;
  mainCategory: ParentCategory;
  mainCategoryKo: string;
  subCategoryId: number;
  subCategory: string;
  subCategoryKo: string;
  address: string;
  sido: string;
  sigungu: string;
  phone: string;
  homepageUrl: string | null;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
}

export interface InfoPageResponse {
  selectedMainCategory: ParentCategory | null;
  selectedMainCategoryKo: string | null;
  selectedSubCategoryId: number | null;
  selectedSubCategory: string | null;
  selectedSubCategoryKo: string | null;
  items: {
    content: InfoItemResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}

export interface InfoDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: InfoDetail;
}

export interface InfoDetail {
  infoItemId: number;
  name: string;
  mainCategory: ParentCategory;
  mainCategoryKo: string;
  subCategoryId: number;
  subCategory: string;
  subCategoryKo: string;
  address: string;
  sido: string;
  sigungu: string;
  phone: string | null;
  homepageUrl: string | null;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  isScrapped: boolean;
  businessHours: BusinessHour[];
}

export interface BusinessHour {
  dayOfWeek:
    | "월요일"
    | "화요일"
    | "수요일"
    | "목요일"
    | "금요일"
    | "토요일"
    | "일요일";
  openTime: string | null;
  closeTime: string | null;
}

// 리뷰
export interface Review {
  reviewId: number;
  rating: number;
  nickname: string;
  createdAt: string;
  content: string;
  helpfulCount: number;
  isHelpful: boolean;
}

export interface InfoReviewResponse {
  avgRating: number;
  totalCount: number;
  reviews: Review[];
}