import { useQuery } from "@tanstack/react-query";
import { getInfoList } from "@/apis/info";
import type { ParentCategory } from "@/types/info";

interface Props {
  category: ParentCategory;
  subCategory?: number;
  regionLevel1?: string | null;
  regionLevel2?: string | null;
  sort: string;
  page: number;
  size: number;
}

export const useInfoListQuery = ({
  category,
  subCategory,
  regionLevel1,
  regionLevel2,
  sort,
  page,
  size,
}: Props) => {
  return useQuery({
    queryKey: [
      "info-list",
      category,
      subCategory,
      regionLevel1,
      regionLevel2,
      sort,
      page,
      size,
    ],

    queryFn: () =>
      getInfoList({
        category,
        subCategory,
        regionLevel1: regionLevel1 ?? undefined,
        regionLevel2: regionLevel2 ?? undefined,
        sort,
        page,
        size,
      }),
  });
};