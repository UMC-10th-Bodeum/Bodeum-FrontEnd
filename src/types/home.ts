// 추천 소식 Top 5
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

// 바로 찾는 필수 정보
export interface InfoItemCounts {
  institution: number;
  hospital: number;
  welfare: number;
  employment: number;
  education: number;
}

export interface InfoItemCountsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: InfoItemCounts;
}

// 커뮤니티
export interface HomePostPreview {
  postId: number;
  categoryName: string;
  title: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

export interface HomePostPreviewResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: HomePostPreview[];
}