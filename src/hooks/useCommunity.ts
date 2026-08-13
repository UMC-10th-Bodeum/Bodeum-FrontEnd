import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hasStoredAuthSession } from "@/apis/authApi";
import {
  createCommunityComment,
  createCommunityCommentLike,
  createCommunityReply,
  toggleCommunityCommentAdoption,
  updateCommunityComment,
  deleteCommunityComment,
  createCommunityPost,
  createCommunityPostScrap,
  createCommunityPostLike,
  deleteCommunityCommentLike,
  deleteCommunityPostLike,
  deleteCommunityPostScrap,
  getCommunityComments,
  getCommunityPost,
  getCommunityPostSearchSuggestions,
  getCommunityPosts,
  deleteCommunityPost,
  updateCommunityPost,
} from "@/apis/community";
import type {
  CommunityComment,
  CommunityCommentCreatePayload,
  CommunityCommentLikeResult,
  CommunityCommentsResult,
  CommunityPostDetail,
  CommunityPostCreateRequest,
  CommunityPostListParams,
  CommunityPostPage,
} from "@/types/community";
import {
  myPointsQueryOptions,
  USER_COMMENTS_QUERY_KEY,
  USER_DASHBOARD_QUERY_KEY,
} from "@/hooks/useMyPage";

function updateCommunityCommentLike(
  comments: CommunityComment[],
  commentId: number,
  result: CommunityCommentLikeResult,
): CommunityComment[] {
  return comments.map((comment) => ({
    ...comment,
    ...(comment.commentId === commentId
      ? { isLiked: result.isLiked, likeCount: result.likeCount }
      : {}),
    replies: comment.replies
      ? updateCommunityCommentLike(comment.replies, commentId, result)
      : comment.replies,
  }));
}

function invalidateMyPageCommentData(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void Promise.all([
    queryClient.invalidateQueries({ queryKey: USER_COMMENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: USER_DASHBOARD_QUERY_KEY }),
    queryClient.fetchQuery(myPointsQueryOptions),
  ]);
}

function appendCommunityReply(
  comments: CommunityComment[],
  parentCommentId: number,
  createdReply: CommunityComment,
): CommunityComment[] {
  return comments.map((comment) =>
    comment.commentId === parentCommentId
      ? {
          ...comment,
          replies: [...(comment.replies ?? []), createdReply],
        }
      : {
          ...comment,
          replies: comment.replies
            ? appendCommunityReply(comment.replies, parentCommentId, createdReply)
            : comment.replies,
        },
  );
}

function incrementCommunityPostCommentCount(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
) {
  queryClient.setQueryData<CommunityPostDetail>(communityPostKeys.detail(postId), (currentPost) =>
    currentPost ? { ...currentPost, commentCount: currentPost.commentCount + 1 } : currentPost,
  );

  queryClient.setQueriesData<CommunityPostPage>(
    {
      predicate: ({ queryKey }) =>
        queryKey[0] === communityPostKeys.all[0] &&
        queryKey.length === 2 &&
        typeof queryKey[1] === "object",
    },
    (currentPage) =>
      currentPage
        ? {
            ...currentPage,
            content: currentPage.content.map((post) =>
              post.postId === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
            ),
          }
        : currentPage,
  );
}

function removeCommentAndCount(
  comments: CommunityComment[],
  targetId: number,
): { comments: CommunityComment[]; removedCount: number } {
  let removed = 0;

  function countCommentTree(comment: CommunityComment): number {
    return (
      1 +
      (comment.replies?.reduce((count, reply) => count + countCommentTree(reply), 0) ?? 0)
    );
  }

  function walk(list: CommunityComment[]): CommunityComment[] {
    return list.flatMap((comment) => {
      if (comment.commentId === targetId) {
        removed += countCommentTree(comment);
        return [];
      }

      return [
        {
          ...comment,
          replies: comment.replies ? walk(comment.replies) : comment.replies,
        },
      ];
    });
  }

  return { comments: walk(comments), removedCount: removed };
}

export const communityPostKeys = {
  all: ["community-posts"] as const,
  detail: (postId: number) => [...communityPostKeys.all, "detail", postId] as const,
  comments: (postId: number) => [...communityPostKeys.detail(postId), "comments"] as const,
  searchSuggestions: (keyword: string, size: number) =>
    [...communityPostKeys.all, "search-suggestions", keyword, size] as const,
  list: (
    { page = 0, size = 14, sort, keyword, categoryCode }: CommunityPostListParams,
    viewerScope: "member" | "guest",
  ) =>
    [
      ...communityPostKeys.all,
      {
        page,
        size,
        sort: sort ?? "SERVER_DEFAULT",
        viewerScope,
        keyword: keyword?.trim() ?? "",
        categoryCode: categoryCode ?? "ALL",
      },
    ] as const,
};

export function useCommunityPosts(params: CommunityPostListParams) {
  const viewerScope = hasStoredAuthSession() ? "member" : "guest";

  return useQuery({
    queryKey: communityPostKeys.list(params, viewerScope),
    queryFn: () => getCommunityPosts(params),
    placeholderData: keepPreviousData,
  });
}

export function useCommunityPostSearchSuggestions(keyword: string, size = 10) {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: communityPostKeys.searchSuggestions(normalizedKeyword, size),
    queryFn: () => getCommunityPostSearchSuggestions(normalizedKeyword, size),
    enabled: normalizedKeyword.length >= 2 && normalizedKeyword.length <= 50,
  });
}

export function useCommunityPost(postId: number | undefined) {
  return useQuery({
    queryKey: communityPostKeys.detail(postId ?? 0),
    queryFn: () => getCommunityPost(postId as number),
    enabled: postId !== undefined,
  });
}

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CommunityPostCreateRequest) => createCommunityPost(payload),
    onSuccess: (createdPost) => {
      queryClient.setQueryData(communityPostKeys.detail(createdPost.postId), createdPost);
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === communityPostKeys.all[0] &&
          queryKey.length === 2 &&
          typeof queryKey[1] === "object",
      });
    },
  });
}

export function useCommunityComments(postId: number | undefined) {
  return useQuery({
    queryKey: communityPostKeys.comments(postId ?? 0),
    queryFn: () => getCommunityComments(postId as number),
    enabled: postId !== undefined,
  });
}

export function useCreateCommunityComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CommunityCommentCreatePayload) => createCommunityComment(postId, payload),
    onSuccess: (createdComment) => {
      queryClient.setQueryData<CommunityCommentsResult>(
        communityPostKeys.comments(postId),
        (currentComments) => {
          if (!currentComments) return currentComments;

          return {
            ...currentComments,
            totalCount: currentComments.totalCount + 1,
            comments: [...currentComments.comments, createdComment],
          };
        },
      );

      incrementCommunityPostCommentCount(queryClient, postId);
      invalidateMyPageCommentData(queryClient);
    },
  });
}

interface CreateCommunityReplyVariables extends CommunityCommentCreatePayload {
  parentCommentId: number;
}

export function useCreateCommunityReply(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentCommentId, content }: CreateCommunityReplyVariables) =>
      createCommunityReply(parentCommentId, { content }),
    onSuccess: (createdReply, { parentCommentId }) => {
      queryClient.setQueryData<CommunityCommentsResult>(
        communityPostKeys.comments(postId),
        (currentComments) =>
          currentComments
            ? {
                ...currentComments,
                totalCount: currentComments.totalCount + 1,
                comments: appendCommunityReply(
                  currentComments.comments,
                  parentCommentId,
                  createdReply,
                ),
              }
            : currentComments,
      );

      incrementCommunityPostCommentCount(queryClient, postId);
      invalidateMyPageCommentData(queryClient);
    },
  });
}

interface ToggleCommunityCommentLikeVariables {
  commentId: number;
  isCurrentlyLiked: boolean;
}

export function useToggleCommunityCommentLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isCurrentlyLiked }: ToggleCommunityCommentLikeVariables) =>
      isCurrentlyLiked
        ? deleteCommunityCommentLike(commentId)
        : createCommunityCommentLike(commentId),
    onSuccess: (result, { commentId }) => {
      queryClient.setQueryData<CommunityCommentsResult>(
        communityPostKeys.comments(postId),
        (currentComments) =>
          currentComments
            ? {
                ...currentComments,
                comments: updateCommunityCommentLike(currentComments.comments, commentId, result),
              }
            : currentComments,
      );
    },
  });
}

export function useToggleCommunityCommentAdoption(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => toggleCommunityCommentAdoption(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityPostKeys.comments(postId),
      });
    },
  });
}

function updateCommentInTree(
  comments: CommunityComment[],
  updatedComment: CommunityComment,
): CommunityComment[] {
  return comments.map((comment) => {
    if (comment.commentId === updatedComment.commentId) {
      return {
        ...comment,
        content: updatedComment.content,
      };
    }

    return {
      ...comment,
      replies: comment.replies ? updateCommentInTree(comment.replies, updatedComment) : [],
    };
  });
}

export function useUpdateCommunityComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation<CommunityComment, unknown, { commentId: number; content: string }>({
    mutationFn: ({ commentId, content }) => updateCommunityComment(commentId, { content }),

    onSuccess: (updatedComment) => {
      queryClient.setQueryData<CommunityCommentsResult>(
        communityPostKeys.comments(postId),
        (currentComments) => {
          if (!currentComments) return currentComments;

          return {
            ...currentComments,
            comments: updateCommentInTree(currentComments.comments, updatedComment),
          };
        },
      );
    },
  });
}

export function useDeleteCommunityComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: (commentId: number) => deleteCommunityComment(commentId),
    onSuccess: (_res, commentId) => {
      const commentsKey = communityPostKeys.comments(postId);
      const currentComments = queryClient.getQueryData<CommunityCommentsResult>(commentsKey);
      const result = currentComments
        ? removeCommentAndCount(currentComments.comments, commentId)
        : undefined;

      if (!currentComments || !result?.removedCount) {
        void queryClient.invalidateQueries({ queryKey: communityPostKeys.detail(postId) });
        void queryClient.invalidateQueries({
          predicate: ({ queryKey }) =>
            queryKey[0] === communityPostKeys.all[0] &&
            queryKey.length === 2 &&
            typeof queryKey[1] === "object",
        });
        return;
      }

      queryClient.setQueryData<CommunityCommentsResult>(commentsKey, {
        ...currentComments,
        totalCount: Math.max(0, currentComments.totalCount - result.removedCount),
        comments: result.comments,
      });

      queryClient.setQueryData<CommunityPostDetail>(communityPostKeys.detail(postId), (post) =>
        post
          ? { ...post, commentCount: Math.max(0, post.commentCount - result.removedCount) }
          : post,
      );

      queryClient.setQueriesData<CommunityPostPage>(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === communityPostKeys.all[0] &&
            queryKey.length === 2 &&
            typeof queryKey[1] === "object",
        },
        (currentPage) =>
          currentPage
            ? {
                ...currentPage,
                content: currentPage.content.map((post) =>
                  post.postId === postId
                    ? {
                        ...post,
                        commentCount: Math.max(0, post.commentCount - result.removedCount),
                      }
                    : post,
                ),
              }
            : currentPage,
      );
    },
  });
}

export function useToggleCommunityPostScrap(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyScrapped: boolean) =>
      isCurrentlyScrapped ? deleteCommunityPostScrap(postId) : createCommunityPostScrap(postId),
    onSuccess: (result) => {
      queryClient.setQueryData<CommunityPostDetail>(
        communityPostKeys.detail(postId),
        (currentPost) =>
          currentPost
            ? {
                ...currentPost,
                isScrapped: result.isScrapped,
                scrapCount: result.scrapCount,
              }
            : currentPost,
      );
    },
  });
}

export function useToggleCommunityPostLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? deleteCommunityPostLike(postId) : createCommunityPostLike(postId),
    onSuccess: (result) => {
      queryClient.setQueryData<CommunityPostDetail>(
        communityPostKeys.detail(postId),
        (currentPost) =>
          currentPost
            ? {
                ...currentPost,
                isLiked: result.isLiked,
                likeCount: result.likeCount,
              }
            : currentPost,
      );

      queryClient.setQueriesData<CommunityPostPage>(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === communityPostKeys.all[0] &&
            queryKey.length === 2 &&
            typeof queryKey[1] === "object",
        },
        (currentPage) =>
          currentPage
            ? {
                ...currentPage,
                content: currentPage.content.map((post) =>
                  post.postId === postId
                    ? {
                        ...post,
                        isLiked: result.isLiked,
                        likeCount: result.likeCount,
                      }
                    : post,
                ),
              }
            : currentPage,
      );
    },
  });
}

export function useDeleteCommunityPost(postId?: number) {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number | undefined>({
    mutationFn: (id?: number) => deleteCommunityPost(id ?? (postId as number)),
    onSuccess: (_data, variables) => {
      const deletedId = variables ?? postId;

      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey[0] === communityPostKeys.all[0],
      });

      if (typeof deletedId === "number") {
        queryClient.removeQueries({ queryKey: communityPostKeys.detail(deletedId) });
      }
    },
  });
}

export function useUpdateCommunityPost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateCommunityPost>[1]) =>
      updateCommunityPost(postId, payload),
    onSuccess: (updated: CommunityPostDetail) => {
      queryClient.setQueryData<CommunityPostDetail>(communityPostKeys.detail(postId), updated);

      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === communityPostKeys.all[0] &&
          queryKey.length === 2 &&
          typeof queryKey[1] === "object",
      });
    },
  });
}
