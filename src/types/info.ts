export type ParentCategory =
  | "INSTITUTION"
  | "HOSPITAL"
  | "WELFARE"
  | "EMPLOYMENT"
  | "EDUCATION";

export interface InfoSubCategory {
  id: number;
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

export interface InfoItem {
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
  homepageUrl: string;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  tags: string[];
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface InfoListResponse {
  selectedMainCategory: ParentCategory;
  selectedMainCategoryKo: string;
  selectedSubCategoryId: number;
  selectedSubCategory: string;
  selectedSubCategoryKo: string;
  items: PageResponse<InfoItem>;
}export interface BusinessHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
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
  phone: string;
  homepageUrl: string;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  isScrapped: boolean;
  tags: string[];
  businessHours: BusinessHour[];
}

// 리뷰
export interface CreateInfoReviewRequest {
  rating: number;
  content: string;
  imageUrls: string[];
}

export interface InfoReview {
  infoReviewId: number;
  userId: number;
  userNickname: string;
  rating: number;
  content: string;
  imageUrls: string[];
  helpfulCount: number;
  createdAt: string;
}

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