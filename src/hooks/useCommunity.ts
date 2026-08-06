import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCommunityComment,
  createCommunityCommentLike,
  createCommunityReply,
  createCommunityPost,
  createCommunityPostScrap,
  createCommunityPostLike,
  deleteCommunityCommentLike,
  deleteCommunityPostLike,
  deleteCommunityPostScrap,
  getCommunityComments,
  getCommunityPost,
  getCommunityPosts,
  deleteCommunityPost,
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

export const communityPostKeys = {
  all: ["community-posts"] as const,
  detail: (postId: number) => [...communityPostKeys.all, "detail", postId] as const,
  comments: (postId: number) => [...communityPostKeys.detail(postId), "comments"] as const,
  list: ({ page = 0, size = 14, sort = "view", keyword, categoryCode }: CommunityPostListParams) =>
    [
      ...communityPostKeys.all,
      {
        page,
        size,
        sort,
        keyword: keyword?.trim() ?? "",
        categoryCode: categoryCode ?? "ALL",
      },
    ] as const,
};

export function useCommunityPosts(params: CommunityPostListParams) {
  return useQuery({
    queryKey: communityPostKeys.list(params),
    queryFn: () => getCommunityPosts(params),
    placeholderData: keepPreviousData,
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
