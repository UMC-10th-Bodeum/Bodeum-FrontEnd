import type { InfoSearchResponse } from "@/types/search";
import api from "./axios";

export const getInfoSearch = async (keyword: string) => {
  const { data } = await api.get<InfoSearchResponse>(
    "/api/v1/info-items/search",
    {
      params: { keyword },
    }
  );

  return data.result.items;
};