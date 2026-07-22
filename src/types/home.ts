export interface RecommendedNews {
  newsId: number;
  title: string;
  thumbnailUrl: string;
  region: number;
  dDay: string;
  status: string;
  viewCount: number;
}

export interface RecommendedNewsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RecommendedNews[];
}