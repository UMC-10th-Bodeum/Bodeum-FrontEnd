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

export interface HomeNewsPreview {
  newsId: number;
  region: number;
  title: string;
  likeCount: number;
  viewCount: number;
}

export interface HomeNewsPreviewResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: HomeNewsPreview[];
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
export interface DisabilityTag {
  code: string;
  label: string;
}

export interface RecommendedCommunityPost {
  postId: number;
  disabilityTags: DisabilityTag[];
  categoryName: string;
  authorDisplay: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface RecommendedCommunityPostResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RecommendedCommunityPost[];
}

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