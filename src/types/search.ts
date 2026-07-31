export interface InfoSearchResult {
  infoId: number;
  category: "INSTITUTION" | "HOSPITAL" | "WELFARE" | "EMPLOYMENT" | "EDUCATION";
  name: string;
  address: string;
  viewCount: number;
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