import type { InfoSearchResponse } from "@/types/search";
import type { InfoListResponse, ParentCategory } from "@/types/info";
import api from "./axios";
import type { ApiResponse } from "./apiTypes";

export const getInfoSearch = async (keyword: string) => {
  const { data } = await api.get<InfoSearchResponse>(
    "/api/v1/info-items/search",
    {
      params: { keyword },
    }
  );

  return data.result.items;
};

interface GetInfoListParams {
  category?: ParentCategory;
  subCategory?: number;
  regionLevel1?: string;
  regionLevel2?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export const getInfoList = async (params: GetInfoListParams) => {
  const { data } = await api.get<ApiResponse<InfoListResponse>>(
    "/api/v1/info-items",
    {
      params,
    }
  );

  return data.result;
};