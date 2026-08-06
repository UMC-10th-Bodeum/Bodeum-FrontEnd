import type { ApiResponse } from "./apiTypes";
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
    if (!parentComment) return;

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

export const getCommunityPost = async (postId: number) => {
  const { data } = await api.get<ApiResponse<CommunityPostDetail>>(
    `/api/v1/community/posts/${postId}`,
  );

  return data.result;
};

export const createCommunityPost = async (payload: CommunityPostCreateRequest) => {
  const { data } = await api.post<ApiResponse<CommunityPostDetail>>(
    "/api/v1/community/posts",
    payload,
  );

  return data.result;
};

export const deleteCommunityPost = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<unknown>>(
    `/api/v1/community/posts/${postId}`,
  );

  return data.result;
};

export const getCommunityComments = async (postId: number) => {
  const { data } = await api.get<ApiResponse<CommunityCommentsResult>>(
    `/api/v1/community/posts/${postId}/comments`,
  );

  return normalizeCommunityComments(data.result);
};

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

export const createCommunityCommentLike = async (commentId: number) => {
  const { data } = await api.put<ApiResponse<CommunityCommentLikeResult>>(
    `/api/v1/community/comments/${commentId}/likes`,
  );

  return data.result;
};

export const deleteCommunityCommentLike = async (commentId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityCommentLikeResult>>(
    `/api/v1/community/comments/${commentId}/likes`,
  );

  return data.result;
};

export const createCommunityPostScrap = async (postId: number) => {
  const { data } = await api.put<ApiResponse<CommunityPostScrapResult>>(
    `/api/v1/community/posts/${postId}/scraps`,
  );

  return data.result;
};

export const deleteCommunityPostScrap = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityPostScrapResult>>(
    `/api/v1/community/posts/${postId}/scraps`,
  );

  return data.result;
};

export const createCommunityPostLike = async (postId: number) => {
  const { data } = await api.put<ApiResponse<CommunityPostLikeResult>>(
    `/api/v1/community/posts/${postId}/likes`,
  );

  return data.result;
};

export const deleteCommunityPostLike = async (postId: number) => {
  const { data } = await api.delete<ApiResponse<CommunityPostLikeResult>>(
    `/api/v1/community/posts/${postId}/likes`,
  );

  return data.result;
};
