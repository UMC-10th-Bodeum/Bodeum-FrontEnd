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

export interface OperationHour {
  day: string;
  time: string;
}

export interface InfoDetail {
  infoId: number;
  category: ParentCategory;
  name: string;
  introduction: string;
  tags: string[];
  operationHours: OperationHour[];
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  isScraped: boolean;
  avgRating: number;
  reviewCount: number;
}

export interface GetInfoDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: InfoDetail;
}