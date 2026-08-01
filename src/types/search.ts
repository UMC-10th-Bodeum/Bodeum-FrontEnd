import type { InfoCategory } from "@/constants/infoCategory";

export interface InfoSearchResult {
  infoItemId: number;
  name: string;
  category: InfoCategory;
  categoryLabel: string;
  regionLevel1: string;
  regionLevel2: string;
  tags: string[];
}

export interface InfoSearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: InfoSearchResult[];
  };
}

export interface SearchSuggestion {
  text: string;
  type: "NEWS_TITLE" | "COMMUNITY_TITLE";
}

export interface SearchSuggestionResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    suggestions: SearchSuggestion[];
  };
}