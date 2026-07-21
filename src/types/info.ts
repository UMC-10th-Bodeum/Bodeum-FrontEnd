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

export interface InfoDetail {
  id: number;

  category: string;
  subCategory: string;
  organizationType: string;

  name: string;

  thumbnail: string;

  address: string;
  district: string;
  phone: string;
  website?: string;

  views: number;
  scraps: number;
  reviews: number;

  updatedAt: string;

  introduction: string;

  specialties: string[];

  hours: BusinessHour[];

  notice: string;

  location: {
    lat: number;
    lng: number;
    distance: string;
  };

  reviewList: Review[];
}

export interface BusinessHour {
  day: string;
  open?: string;
  close?: string;
  description?: string;
  closed: boolean;
}

export interface Review {
  id: number;

  nickname: string;

  profileImage?: string;

  rating: number;

  createdAt: string;

  content: string;
}