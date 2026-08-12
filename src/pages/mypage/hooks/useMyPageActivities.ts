import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "@/apis/apiError";
import { showToast } from "@/components/Toast";
import {
  USER_COMMENTS_QUERY_KEY,
  USER_DASHBOARD_QUERY_KEY,
  USER_POSTS_QUERY_KEY,
  USER_SCRAPS_QUERY_KEY,
  useDeleteMyComment,
  useDeleteMyPost,
  useDeleteMyPostScrap,
  useDeleteMyScrap,
  useMyComments,
  useMyPosts,
  useMyScraps,
} from "@/hooks/useMyPage";
import type {
  MyPageCommentItem,
  MyPageItem,
  MyPagePostItem,
  MyPageScrapItem,
  MyPageTabKey,
} from "@/types/mypage";
import { formatDateWithDots } from "@/utils/time";

const MY_ACTIVITY_PAGE_SIZE = 6;

function isMyPageTabKey(value: string | null): value is MyPageTabKey {
  return value === "saved" || value === "posts" || value === "comments";
}

export function useMyPageActivities() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutateAsync: deleteScrap } = useDeleteMyScrap();
  const { mutateAsync: deletePostScrap } = useDeleteMyPostScrap();
  const { mutateAsync: deletePost } = useDeleteMyPost();
  const { mutateAsync: deleteComment } = useDeleteMyComment();
  const tabParam = searchParams.get("tab");
  const activeTab: MyPageTabKey = isMyPageTabKey(tabParam) ? tabParam : "saved";
  const setActiveTab = (tab: MyPageTabKey) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", tab);
    setSearchParams(nextSearchParams);
  };
  const [scrapsPage, setScrapsPage] = useState(0);
  const [postsPage, setPostsPage] = useState(0);
  const [commentsPage, setCommentsPage] = useState(0);
  const scrapsQuery = useMyScraps(scrapsPage, MY_ACTIVITY_PAGE_SIZE, activeTab === "saved");
  const postsQuery = useMyPosts(postsPage, MY_ACTIVITY_PAGE_SIZE, activeTab === "posts");
  const commentsQuery = useMyComments(
    commentsPage,
    MY_ACTIVITY_PAGE_SIZE,
    activeTab === "comments",
  );
  const [hiddenScrapIds, setHiddenScrapIds] = useState<Set<number | string>>(
    () => new Set(),
  );
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<number>>(() => new Set());
  const [hiddenCommentIds, setHiddenCommentIds] = useState<Set<number>>(() => new Set());
  const [deletingScrapId, setDeletingScrapId] = useState<number | string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<MyPagePostItem | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<MyPageCommentItem | null>(null);

  const deleteScrapItem = async (item: MyPageScrapItem) => {
    if (deletingScrapId !== null) return;
    setDeletingScrapId(item.id);

    try {
      if (item.scrapType === "POST") {
        await deletePostScrap(item.postId);
      } else {
        await deleteScrap({ scrapId: item.scrapId, scrapType: item.scrapType });
      }
      setHiddenScrapIds((current) => new Set(current).add(item.id));

      const currentPageItemCount = scrapsQuery.data
        ? scrapsQuery.data.infoScraps.length
          + scrapsQuery.data.newsScraps.length
          + scrapsQuery.data.postScraps.length
        : 0;
      if (scrapsPage > 0 && currentPageItemCount === 1) {
        setScrapsPage((current) => Math.max(0, current - 1));
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_SCRAPS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: USER_DASHBOARD_QUERY_KEY }),
      ]);
      showToast("green", "저장한 정보에서 삭제했습니다.");
    } catch (error) {
      showToast("red", getApiErrorMessage(error, "저장한 정보를 삭제하지 못했습니다."));
    } finally {
      setDeletingScrapId(null);
    }
  };

  const deletePostItem = async () => {
    if (!postToDelete || deletingPostId !== null) return;
    setDeletingPostId(postToDelete.id);

    try {
      await deletePost(postToDelete.postId);
      setHiddenPostIds((current) => new Set(current).add(postToDelete.postId));
      if (postsPage > 0 && postsQuery.data?.posts.length === 1) {
        setPostsPage((current) => Math.max(0, current - 1));
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_POSTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: USER_DASHBOARD_QUERY_KEY }),
      ]);
      showToast("green", "게시글을 삭제했습니다.");
      setPostToDelete(null);
    } catch (error) {
      showToast("red", getApiErrorMessage(error, "게시글을 삭제하지 못했습니다."));
    } finally {
      setDeletingPostId(null);
    }
  };

  const deleteCommentItem = async () => {
    if (!commentToDelete || deletingCommentId !== null) return;
    setDeletingCommentId(commentToDelete.id);

    try {
      await deleteComment(commentToDelete.id);
      setHiddenCommentIds((current) => new Set(current).add(commentToDelete.id));
      if (commentsPage > 0 && commentsQuery.data?.comments.length === 1) {
        setCommentsPage((current) => Math.max(0, current - 1));
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_COMMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: USER_DASHBOARD_QUERY_KEY }),
      ]);
      showToast("green", "댓글을 삭제했습니다.");
      setCommentToDelete(null);
    } catch (error) {
      showToast("red", getApiErrorMessage(error, "댓글을 삭제하지 못했습니다."));
    } finally {
      setDeletingCommentId(null);
    }
  };

  const scrapItems: MyPageScrapItem[] = scrapsQuery.data
    ? [
        ...scrapsQuery.data.infoScraps.map((scrap) => ({
          item: {
            id: `info-${scrap.scrapId}`,
            postId: scrap.infoItemId,
            type: "scrap" as const,
            scrapId: scrap.scrapId,
            scrapType: "INFO" as const,
            title: scrap.name,
            targetPath: `/info/${scrap.mainCategory}/${scrap.infoItemId}`,
            sourceLabel: scrap.mainCategoryKo || "정보",
            date: formatDateWithDots(scrap.scrappedAt),
          },
          scrappedAt: scrap.scrappedAt,
        })),
        ...scrapsQuery.data.newsScraps.map((scrap) => ({
          item: {
            id: `news-${scrap.scrapId}`,
            postId: scrap.newsId,
            type: "scrap" as const,
            scrapId: scrap.scrapId,
            scrapType: "NEWS" as const,
            title: scrap.title,
            targetPath: `/news/${scrap.newsId}`,
            sourceLabel: "소식",
            date: formatDateWithDots(scrap.scrappedAt),
          },
          scrappedAt: scrap.scrappedAt,
        })),
        ...scrapsQuery.data.postScraps.map((scrap) => ({
          item: {
            id: `post-${scrap.scrapId}`,
            postId: scrap.postId,
            type: "scrap" as const,
            scrapId: scrap.scrapId,
            scrapType: "POST" as const,
            title: scrap.title,
            targetPath: `/community/${scrap.postId}`,
            sourceLabel: "커뮤니티 게시글",
            date: formatDateWithDots(scrap.scrappedAt),
          },
          scrappedAt: scrap.scrappedAt,
        })),
      ]
        .sort((left, right) => right.scrappedAt.localeCompare(left.scrappedAt))
        .map(({ item }) => item)
        .filter((item) => !hiddenScrapIds.has(item.id))
    : [];

  const items: MyPageItem[] = activeTab === "saved"
    ? scrapItems
    : activeTab === "posts"
      ? (postsQuery.data?.posts ?? []).map((post) => ({
          id: post.postId,
          postId: post.postId,
          type: "post" as const,
          title: post.title,
          date: formatDateWithDots(post.createdAt),
        })).filter((item) => !hiddenPostIds.has(item.id))
      : (commentsQuery.data?.comments ?? []).map((comment) => ({
          id: comment.commentId,
          postId: comment.postId,
          type: "comment" as const,
          comment: comment.content,
          postTitle: comment.postTitle,
          date: formatDateWithDots(comment.createdAt),
        })).filter((item) => !hiddenCommentIds.has(item.id));

  const isPending = activeTab === "saved"
    ? scrapsQuery.isPending
    : activeTab === "posts"
      ? postsQuery.isPending
      : commentsQuery.isPending;
  const error = activeTab === "saved"
    ? scrapsQuery.error
    : activeTab === "posts"
      ? postsQuery.error
      : commentsQuery.error;
  const currentPage = activeTab === "saved"
    ? scrapsPage
    : activeTab === "posts"
      ? postsPage
      : commentsPage;
  const totalPages = activeTab === "saved"
    ? Math.ceil((scrapsQuery.data?.totalCount ?? 0) / MY_ACTIVITY_PAGE_SIZE)
    : activeTab === "posts"
      ? (postsQuery.data?.totalPages ?? 0)
      : (commentsQuery.data?.totalPages ?? 0);

  const setPage = (page: number) => {
    if (activeTab === "saved") setScrapsPage(page);
    else if (activeTab === "posts") setPostsPage(page);
    else setCommentsPage(page);
  };

  const retry = () => {
    if (activeTab === "saved") void scrapsQuery.refetch();
    else if (activeTab === "posts") void postsQuery.refetch();
    else void commentsQuery.refetch();
  };

  const requestDelete = (item: MyPageItem) => {
    if (item.type === "scrap") void deleteScrapItem(item);
    else if (item.type === "post") setPostToDelete(item);
    else setCommentToDelete(item);
  };

  return {
    activeTab,
    setActiveTab,
    items,
    isPending,
    error,
    retry,
    currentPage,
    totalPages,
    setPage,
    requestDelete,
    deleteDisabled:
      deletingScrapId !== null || deletingPostId !== null || deletingCommentId !== null,
    postToDelete,
    commentToDelete,
    cancelPostDelete: () => setPostToDelete(null),
    cancelCommentDelete: () => setCommentToDelete(null),
    confirmPostDelete: () => void deletePostItem(),
    confirmCommentDelete: () => void deleteCommentItem(),
    isDeletingPost: deletingPostId !== null,
    isDeletingComment: deletingCommentId !== null,
  };
}
