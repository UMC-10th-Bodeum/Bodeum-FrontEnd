import type { InfoSearchResponse } from "@/types/search";
import type { CreateInfoReviewRequest, InfoDetail, InfoListResponse, InfoReview, InfoReviewListResult, ParentCategory } from "@/types/info";
import api from "./axios";
import type { ApiResponse } from "./apiTypes";

interface GetInfoListParams {
  category?: ParentCategory;
  subCategory?: number;
  regionLevel1?: string;
  regionLevel2?: string;
  sort?: string;
  page?: number;
  size?: number;
}

// 정보 검색 
export const getInfoSearch = async (keyword: string) => {
  const { data } = await api.get<InfoSearchResponse>(
    "/api/v1/info-items/search",
    {
      params: { keyword },
    }
  );

  return data.result.items;
};

// 정보 목록 조회
export const getInfoList = async (params: GetInfoListParams) => {
  const { data } = await api.get<ApiResponse<InfoListResponse>>(
    "/api/v1/info-items",
    {
      params,
    }
  );

  return data.result;
};

// 정보 상세 조회
export const getInfoDetail = async (infoItemId: number) => {
  const { data } = await api.get<ApiResponse<InfoDetail>>(
    `/api/v1/info-items/${infoItemId}`
  );

  return data.result;
};

// 정보 후기 작성
export const createInfoReview = async (
  infoItemId: number,
  body: CreateInfoReviewRequest,
) => {
  const { data } = await api.post<ApiResponse<InfoReview>>(
    `/api/v1/info-items/${infoItemId}/reviews`,
    body,
  );

  return data.result;
};

// 정보 후기 조회
export const getInfoReviews = async (
  infoItemId: number,
  page: number,
  size: number
): Promise<InfoReviewListResult> => {
  const { data } = await api.get<ApiResponse<InfoReviewListResult>>(
    `/api/v1/info-items/${infoItemId}/reviews`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return data.result;
};

// 후기 도움돼요 토글
export const toggleReviewHelpful = async (
  infoItemId: number,
  infoReviewId: number,
) => {
  const { data } = await api.post(
    `/api/v1/info-items/${infoItemId}/reviews/${infoReviewId}/helpful`,
  );

  return data.result;
};

// 정보 스크랩 토글
export const toggleInfoScrap = async (infoItemId: number) => {
  const { data } = await api.post(
    `/api/v1/info-items/${infoItemId}/scrap`,
  );

  return data.result;
};