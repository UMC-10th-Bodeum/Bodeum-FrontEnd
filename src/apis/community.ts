import type { ApiResponse } from "@/types/api";
import api from "./axios";
import type {
  CommunityComment,
  CommunityCommentCreatePayload,
  CommunityCommentLikeResult,
  CommunityCommentsResult,
  CommunityPostDetail,
  CommunityPostCreateRequest,
  CommunityPostLikeResult,
  CommunityPostListParams,
  CommunityPostPage,
  CommunityPostSearchSuggestionsResult,
  CommunityPostScrapResult,
} from "@/types/community";

function normalizeCommunityComment(comment: CommunityComment): CommunityComment {
  const replies = Array.isArray(comment.replies)
    ? comment.replies
        .filter((reply): reply is CommunityComment => typeof reply === "object" && reply !== null)
        .map(normalizeCommunityComment)
    : [];

  return {
    ...comment,
    authorNickname: comment.authorNickname?.trim() || "익명",
    replies,
  };
}

function normalizeCommunityComments(result: CommunityCommentsResult): CommunityCommentsResult {
  const comments = result.comments.map(normalizeCommunityComment);
  const commentsById = new Map(comments.map((comment) => [comment.commentId, comment]));
  const rootComments: CommunityComment[] = [];

  comments.forEach((comment) => {
    if (!comment.parentCommentId) {
      rootComments.push(comment);
      return;
    }

    const parentComment = commentsById.get(comment.parentCommentId);
    if (!parentComment) {
      rootComments.push(comment);
      return;
    }

    const alreadyIncluded = parentComment.replies?.some(
      (reply) => reply.commentId === comment.commentId,
    );

    if (!alreadyIncluded) {
      parentComment.replies = [...(parentComment.replies ?? []), comment];
    }
  });

  return {
    ...result,
    comments: rootComments,
  };
}

// 게시글 스크랩 등록
export const createCommunityPostScrap = async (postId: number) => {
  const { data } = await api.put<ApiResponse<CommunityPostScrapResult>>(
    `/api/v1/community/posts/${postId}/scraps`,
  );

  return data.result;
};

// 게시글 스크랩 취소
export const deleteCommunityPostScrap = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityPostScrapResult>>(
    `/api/v1/community/posts/${postId}/scraps`,
  );

  return data.result;
};

// 게시글 공감 등록
export const createCommunityPostLike = async (postId: number) => {
  const { data } = await api.put<ApiResponse<CommunityPostLikeResult>>(
    `/api/v1/community/posts/${postId}/likes`,
  );

  return data.result;
};

// 게시글 공감 삭제
export const deleteCommunityPostLike = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityPostLikeResult>>(
    `/api/v1/community/posts/${postId}/likes`,
  );

  return data.result;
};

// 게시글 목록 조회 및 검색
export const getCommunityPosts = async ({
  page = 0,
  size = 14,
  sort = "view",
  keyword,
  categoryCode,
}: CommunityPostListParams = {}) => {
  const normalizedKeyword = keyword?.trim();
  const { data } = await api.get<ApiResponse<CommunityPostPage>>("/api/v1/community/posts", {
    params: {
      page,
      size,
      sort,
      ...(normalizedKeyword && normalizedKeyword.length >= 2 ? { keyword: normalizedKeyword } : {}),
      ...(categoryCode ? { categoryCode } : {}),
    },
  });

  return data.result;
};

// 게시글 검색어 추천 조회
export const getCommunityPostSearchSuggestions = async (keyword: string, size = 10) => {
  const { data } = await api.get<ApiResponse<CommunityPostSearchSuggestionsResult>>(
    "/api/v1/community/posts/search/suggestions",
    { params: { keyword: keyword.trim(), size } },
  );

  return data.result.suggestions;
};

// 게시글 작성
export const createCommunityPost = async (payload: CommunityPostCreateRequest) => {
  const { data } = await api.post<ApiResponse<CommunityPostDetail>>(
    "/api/v1/community/posts",
    payload,
  );

  return data.result;
};

// 게시글 상세 조회
export const getCommunityPost = async (postId: number) => {
  const { data } = await api.get<ApiResponse<CommunityPostDetail>>(
    `/api/v1/community/posts/${postId}`,
  );

  return data.result;
};

// 게시글 삭제
export const deleteCommunityPost = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<unknown>>(`/api/v1/community/posts/${postId}`);

  return data.result;
};

// 게시글 수정
export const updateCommunityPost = async (
  postId: number,
  payload: Partial<{
    boardType: string;
    anonymityType: string;
    title: string;
    content: string;
    disabilityTypes: string[];
    hashtags: string[];
    imageUrls: string[];
  }>,
) => {
  const { data } = await api.patch<ApiResponse<CommunityPostDetail>>(
    `/api/v1/community/posts/${postId}`,
    payload,
  );

  return data.result;
};

// 게시글 이미지 업로드
export const uploadCommunityPostImage = async (file: File) => {
  const form = new FormData();
  form.append("image", file);

  const { data } = await api.post<ApiResponse<string>>("/api/v1/community/posts/images", form);

  return data.result;
};

// 댓글 공감 등록
export const createCommunityCommentLike = async (commentId: number) => {
  const { data } = await api.put<ApiResponse<CommunityCommentLikeResult>>(
    `/api/v1/community/comments/${commentId}/likes`,
  );

  return data.result;
};

// 댓글 공감 삭제
export const deleteCommunityCommentLike = async (commentId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityCommentLikeResult>>(
    `/api/v1/community/comments/${commentId}/likes`,
  );

  return data.result;
};

// 게시글 댓글 조회
export const getCommunityComments = async (postId: number) => {
  const { data } = await api.get<ApiResponse<CommunityCommentsResult>>(
    `/api/v1/community/posts/${postId}/comments`,
  );

  return normalizeCommunityComments(data.result);
};

// 댓글 등록
export const createCommunityComment = async (
  postId: number,
  payload: CommunityCommentCreatePayload,
) => {
  const { data } = await api.post<ApiResponse<CommunityComment>>(
    `/api/v1/community/posts/${postId}/comments`,
    payload,
  );

  return normalizeCommunityComment(data.result);
};

// 중첩 답글 등록
export const createCommunityReply = async (
  parentCommentId: number,
  payload: CommunityCommentCreatePayload,
) => {
  const { data } = await api.post<ApiResponse<CommunityComment>>(
    `/api/v1/community/comments/${parentCommentId}/replies`,
    payload,
  );

  return normalizeCommunityComment(data.result);
};

// 댓글 채택 및 채택 취소
export const toggleCommunityCommentAdoption = async (commentId: number) => {
  const { data } = await api.post<ApiResponse<CommunityComment>>(
    `/api/v1/community/comments/${commentId}/adopt`,
  );

  return normalizeCommunityComment(data.result);
};

// 댓글 삭제
export const deleteCommunityComment = async (commentId: number) => {
  const { data } = await api.delete<ApiResponse<string>>(`/api/v1/community/comments/${commentId}`);

  return data.result;
};

// 댓글 수정
export const updateCommunityComment = async (commentId: number, payload: { content: string }) => {
  const { data } = await api.patch<ApiResponse<CommunityComment>>(
    `/api/v1/community/comments/${commentId}`,
    payload,
  );

  return normalizeCommunityComment(data.result);
};
