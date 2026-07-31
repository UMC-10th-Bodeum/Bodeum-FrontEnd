import type { ChipVariant } from "@/components/Chips";
import type { InfoItemCategory } from "@/components/InfoItem";

export type NewsType = "ACTIVITY" | "LOCAL";

export interface NewsListItem {
  id: number;
  newsType: NewsType;
  type: InfoItemCategory;
  name: string;
  address: string;
  services: string[];
  chipText?: string;
  chipVariant?: ChipVariant;
  daysRemaining: number;
  thumbnail?: string;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
}

export const newsListItems: NewsListItem[] = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  newsType: index % 2 === 0 ? "ACTIVITY" : "LOCAL",
  type: "PROGRAM",
  name: "드림발달클리닉",
  address: "경기 수원시",
  services: ["늘푸른장애인종합복지관"],
  chipVariant: "recruit",
  chipText: "상시모집",
  daysRemaining: 21,
  viewCount: 1204,
  scrapCount: 1204,
  isScrapped: false,
}));

export const recommendedNewsItems = newsListItems.slice(0, 5);

export const getNewsListItemById = (id: string | undefined) => {
  const newsId = Number(id);

  if (!Number.isInteger(newsId)) {
    return undefined;
  }

  return newsListItems.find((item) => item.id === newsId);
};
