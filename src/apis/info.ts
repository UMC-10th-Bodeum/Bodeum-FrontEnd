import type { InfoSearchResponse } from "@/types/search";
import type { InfoDetail, InfoListResponse, ParentCategory } from "@/types/info";
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