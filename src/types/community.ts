import type { DiagnosisType } from "./diagnosis";
import type {
  CommunityCategory,
  CommunityCategoryCode,
} from "@/constants/communityCategory";

export type CommunityAuthorVisibility = "PROFILE" | "ANONYMOUS";

export interface CommunityPostPayload {
  category: CommunityCategory;
  authorVisibility: CommunityAuthorVisibility;
  title: string;
  content: string;
  images: File[];
}

export interface CommunityPostCreateRequest {
  boardType: CommunityCategoryCode;
  anonymityType: CommunityAnonymityType;
  title: string;
  content: string;
  disabilityTypes?: DiagnosisType[];
  imageUrls?: string[];
}

export interface CommunityPost {
  id: number;
  category: CommunityCategory;
  diagnosis: DiagnosisType;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  imageCount: number;
}

export type CommunityCommentStatus = "ACTIVE";

export interface CommunityComment {
  commentId: number;
  parentCommentId: number | null;
  authorId: number;
  authorNickname: string;
  isMine: boolean;
  content: string;
  isAccepted: boolean;
  likeCount: number;
  isLiked: boolean;
  status: CommunityCommentStatus;
  createdAt: string;
  updatedAt: string;
  replies?: CommunityComment[];
}

export interface CommunityCommentsResult {
  totalCount: number;
  comments: CommunityComment[];
}

export interface CommunityCommentCreatePayload {
  content: string;
}

export interface CommunityPostScrapResult {
  isScrapped: boolean;
  scrapCount: number;
}

export interface CommunityPostLikeResult {
  isLiked: boolean;
  likeCount: number;
}

export interface CommunityCommentLikeResult {
  isLiked: boolean;
  likeCount: number;
}

export type CommunityPostSort = "view" | "scrap" | "comment";

export interface CommunityPostAuthor {
  authorId: number;
  nickname: string;
  profileImageUrl: string;
  level: number;
  badgeName: string;
  isMine: boolean;
}

export interface CommunityPostListItem {
  postId: number;
  boardType: string;
  anonymityType: string;
  title: string;
  content: string;
  isQuestion: boolean;
  author: CommunityPostAuthor;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  scrapCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CommunityPostListParams {
  page?: number;
  size?: number;
  sort?: CommunityPostSort;
  keyword?: string;
  categoryCode?: CommunityCategoryCode;
}

interface CommunityPageSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface CommunityPageable {
  offset: number;
  sort: CommunityPageSort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface CommunityPostPage {
  totalElements: number;
  totalPages: number;
  size: number;
  content: CommunityPostListItem[];
  number: number;
  sort: CommunityPageSort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: CommunityPageable;
  empty: boolean;
}

export type CommunityAnonymityType =
  | "PROFILE_TAG_VISIBLE"
  | "FULLY_ANONYMOUS";

export interface CommunityPostDetail {
  postId: number;
  authorId: number;
  authorNickname: string;
  isMine: boolean;
  boardType: CommunityCategoryCode;
  anonymityType: CommunityAnonymityType;
  title: string;
  content: string;
  isQuestion: boolean;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  scrapCount: number;
  isScrapped: boolean;
  disabilityTypes: DiagnosisType[];
  hashtags: string[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}
