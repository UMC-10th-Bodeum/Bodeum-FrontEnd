export interface InfoSearchResult {
  infoId: number;
  category: "INSTITUTION" | "HOSPITAL" | "WELFARE" | "EMPLOYMENT" | "EDUCATION";
  name: string;
  address: string;
  viewCount: number;
}

export interface NewsSearchResult {
  newsId: number;
  title: string;
  region: string;
  viewCount: number;
}

export interface CommunitySearchResult {
  postId: number;
  categoryName: string;
  title: string;
  viewCount: number;
}

export interface SearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    infoResults: InfoSearchResult[];
    newsResults: NewsSearchResult[];
    communityResults: CommunitySearchResult[];
    totalCount: number;
  };
}