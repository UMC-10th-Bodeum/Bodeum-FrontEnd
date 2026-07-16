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