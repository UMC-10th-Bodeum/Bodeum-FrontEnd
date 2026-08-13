import type { DiagnosisType } from "./diagnosis";
import type { CommunityCategory, CommunityCategoryCode } from "@/constants/communityCategory";

export type CommunityAuthorVisibility = "PROFILE" | "ANONYMOUS";

export interface CommunityPostFormValues {
  category: CommunityCategory;
  authorVisibility: CommunityAuthorVisibility;
  title: string;
  content: string;
  images: File[];
  existingImageUrls: string[];
}

export interface CommunityPostFormInitialValues {
  category: CommunityCategory;
  authorVisibility: CommunityAuthorVisibility;
  title: string;
  content: string;
  existingImageUrls: string[];
}

export interface CommunityPostCreateRequest {
  boardType: CommunityCategoryCode;
  anonymityType: CommunityAnonymityType;
  title: string;
  content: string;
  disabilityTypes?: DiagnosisType[];
  imageUrls?: string[];
}

export type CommunityCommentStatus = "ACTIVE";

export interface CommunityComment {
  commentId: number;
  parentCommentId: number | null;
  authorId: number;
  authorNickname: string;
  profileImageUrl: string | null;
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

export type CommunityPostSort = "latest" | "view" | "like" | "comment";

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
  boardType: CommunityCategoryCode;
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

export interface CommunityPostSearchSuggestion {
  title: string;
  content: string;
  type: "POST_TITLE" | "POST_CONTENT";
}

export interface CommunityPostSearchSuggestionsResult {
  suggestions: CommunityPostSearchSuggestion[];
}

export interface CommunityPostImageUploadResult {
  imageUrl: string;
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

export type CommunityAnonymityType = "PROFILE_TAG_VISIBLE" | "FULLY_ANONYMOUS";

export interface CommunityPostDetail {
  postId: number;
  authorId: number | null;
  authorNickname: string | null;
  authorLevel: number | null;
  childAge: number | null;
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
