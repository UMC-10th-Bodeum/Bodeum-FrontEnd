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