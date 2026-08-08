import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/apis/apiError";
import {
  USER_DASHBOARD_QUERY_KEY,
  USER_COMMENTS_QUERY_KEY,
  USER_POSTS_QUERY_KEY,
  USER_SCRAPS_QUERY_KEY,
  useDeleteMyComment,
  useDeleteMyPost,
  useDeleteMyPostScrap,
  useDeleteMyScrap,
  useMyComments,
  useMyDashboard,
  useMyPoints,
  useMyPosts,
  useMyScraps,
} from "@/hooks/useMyPage";
import { formatDateWithDots } from "@/utils/time";
import Pagination from "@/components/pagination/Pagination";
import { showToast } from "@/components/Toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import ActivityPointCard from "./components/ActivityPointCard";
import BadgeGradeModal from "./components/BadgeGradeModal";
import BadgeHelpModal from "./components/BadgeHelpModal";
import MyPageCard from "./components/MyPageCard";
import MyPageTabs from "./components/MyPageTabs";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import type {
  MyPageCommentItem,
  MyPagePostItem,
  MyPageScrapItem,
  MyPageTabKey,
} from "@/types/mypage";

type BadgeModalType = "grade" | "help" | null;
const MY_ACTIVITY_PAGE_SIZE = 6;

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteScrap } = useDeleteMyScrap();
  const { mutateAsync: deletePostScrap } = useDeleteMyPostScrap();
  const { mutateAsync: deletePost } = useDeleteMyPost();
  const { mutateAsync: deleteComment } = useDeleteMyComment();
  const dashboardQuery = useMyDashboard();
  const pointsQuery = useMyPoints();
  const [activeTab, setActiveTab] = useState<MyPageTabKey>("saved");
  const [scrapsPage, setScrapsPage] = useState(0);
  const scrapsQuery = useMyScraps(
    scrapsPage,
    MY_ACTIVITY_PAGE_SIZE,
    activeTab === "saved",
  );
  const [postsPage, setPostsPage] = useState(0);
  const postsQuery = useMyPosts(
    postsPage,
    MY_ACTIVITY_PAGE_SIZE,
    activeTab === "posts",
  );
  const [commentsPage, setCommentsPage] = useState(0);
  const commentsQuery = useMyComments(
    commentsPage,
    MY_ACTIVITY_PAGE_SIZE,
    activeTab === "comments",
  );
  const [hiddenScrapIds, setHiddenScrapIds] = useState<Set<number | string>>(
    () => new Set(),
  );
  const [deletingScrapId, setDeletingScrapId] = useState<number | string | null>(
    null,
  );
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<number>>(() => new Set());
  const [hiddenCommentIds, setHiddenCommentIds] = useState<Set<number>>(() => new Set());
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<MyPagePostItem | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<MyPageCommentItem | null>(null);
  const [badgeModal, setBadgeModal] = useState<BadgeModalType>(null);

  const deleteItem = async (item: MyPageScrapItem) => {
    if (deletingScrapId !== null) {
      return;
    }

    setDeletingScrapId(item.id);

    try {
      if (item.scrapType === "POST") {
        await deletePostScrap(item.postId);
      } else {
        await deleteScrap({
          scrapId: item.scrapId,
          scrapType: item.scrapType,
        });
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
      showToast(
        "red",
        getApiErrorMessage(error, "저장한 정보를 삭제하지 못했습니다."),
      );
    } finally {
      setDeletingScrapId(null);
    }
  };

  const deletePostItem = async (item: MyPagePostItem) => {
    if (deletingPostId !== null) return;

    setDeletingPostId(item.id);
    try {
      await deletePost(item.postId);
      setHiddenPostIds((current) => new Set(current).add(item.postId));

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

  const deleteCommentItem = async (item: MyPageCommentItem) => {
    if (deletingCommentId !== null) return;

    setDeletingCommentId(item.id);
    try {
      await deleteComment(item.id);
      setHiddenCommentIds((current) => new Set(current).add(item.id));

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

  if (dashboardQuery.isPending) {
    return (
      <div
        role="status"
        className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-background-200 text-h3-onboard text-background-500"
      >
        마이페이지 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div
        role="alert"
        className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-[16px] bg-background-200 text-h3-onboard text-background-500"
      >
        <p>
          {getApiErrorMessage(
            dashboardQuery.error,
            "마이페이지 정보를 불러오지 못했습니다.",
          )}
        </p>
        <button
          type="button"
          onClick={() => void dashboardQuery.refetch()}
          className="cursor-pointer rounded-[10px] bg-main-400 px-[16px] py-[10px] text-background-100"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const dashboard = dashboardQuery.data;
  const counts: Record<MyPageTabKey, number> = {
    saved: dashboard.activitySummary.savedInfoCount,
    posts: dashboard.activitySummary.myPostCount,
    comments: dashboard.activitySummary.myCommentCount,
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
  const displayedItems = activeTab === "saved"
    ? scrapItems
    : activeTab === "posts"
    ? (postsQuery.data?.posts ?? []).map((post) => ({
        id: post.postId,
        postId: post.postId,
        type: "post" as const,
        title: post.title,
        date: formatDateWithDots(post.createdAt),
      })).filter((item) => !hiddenPostIds.has(item.id))
    : activeTab === "comments"
      ? (commentsQuery.data?.comments ?? []).map((comment) => ({
          id: comment.commentId,
          postId: comment.postId,
          type: "comment" as const,
          comment: comment.content,
          postTitle: comment.postTitle,
          date: formatDateWithDots(comment.createdAt),
        })).filter((item) => !hiddenCommentIds.has(item.id))
      : [];
  const isActivityPending = activeTab === "saved"
    ? scrapsQuery.isPending
    : activeTab === "posts"
    ? postsQuery.isPending
    : activeTab === "comments" && commentsQuery.isPending;
  const activityError = activeTab === "saved"
    ? scrapsQuery.error
    : activeTab === "posts"
    ? postsQuery.error
    : activeTab === "comments"
      ? commentsQuery.error
      : null;
  const activityPageData = activeTab === "posts"
    ? postsQuery.data
    : activeTab === "comments"
      ? commentsQuery.data
      : undefined;
  const currentActivityPage = activeTab === "saved"
    ? scrapsPage
    : activeTab === "posts"
      ? postsPage
      : commentsPage;
  const totalActivityPages = activeTab === "saved"
    ? Math.ceil(
        (scrapsQuery.data?.totalCount ?? 0) / MY_ACTIVITY_PAGE_SIZE,
      )
    : (activityPageData?.totalPages ?? 0);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto w-[896px]">
        <ProfileSummaryCard
          dashboard={dashboard}
          counts={counts}
          onSettingsClick={() => navigate("/mypage/settings")}
        />

        <div className="mt-[18px] grid grid-cols-[576px_299px] gap-x-[18px] gap-y-[16px]">
          <section className="col-start-1 row-start-1">
            <MyPageTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />
          </section>

          <div className="col-start-1 row-start-2 flex flex-col gap-[8px]">
            {isActivityPending && (
              <div
                role="status"
                className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500"
              >
                {activeTab === "saved"
                  ? "저장한 정보를 불러오는 중입니다."
                  : activeTab === "posts"
                    ? "작성한 게시글을 불러오는 중입니다."
                    : "작성한 댓글을 불러오는 중입니다."}
              </div>
            )}

            {activityError && (
              <div
                role="alert"
                className="flex h-[144px] flex-col items-center justify-center gap-[12px] rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500"
              >
                <p>
                  {getApiErrorMessage(
                    activityError,
                    activeTab === "saved"
                      ? "저장한 정보를 불러오지 못했습니다."
                      : activeTab === "posts"
                        ? "작성한 게시글을 불러오지 못했습니다."
                        : "작성한 댓글을 불러오지 못했습니다.",
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "saved") {
                      void scrapsQuery.refetch();
                    } else if (activeTab === "posts") {
                      void postsQuery.refetch();
                    } else {
                      void commentsQuery.refetch();
                    }
                  }}
                  className="cursor-pointer text-main-400 underline"
                >
                  다시 시도
                </button>
              </div>
            )}

            {!isActivityPending && !activityError
              && displayedItems.map((item) => (
              <MyPageCard
                key={item.id}
                item={item}
                deleteDisabled={
                  deletingScrapId !== null
                  || deletingPostId !== null
                  || deletingCommentId !== null
                }
                onDelete={
                  item.type === "scrap"
                    ? () => void deleteItem(item)
                    : item.type === "post"
                      ? () => setPostToDelete(item)
                      : () => setCommentToDelete(item)
                }
              />
            ))}

            {!isActivityPending && !activityError
              && displayedItems.length === 0 && (
              <div className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500">
                표시할 항목이 없습니다.
              </div>
            )}

            {totalActivityPages > 1 && (
                <div className="mt-[12px] flex justify-center">
                  <Pagination
                    currentPage={currentActivityPage + 1}
                    totalPages={totalActivityPages}
                    onChange={(page) => {
                      if (activeTab === "saved") {
                        setScrapsPage(page - 1);
                      } else if (activeTab === "posts") {
                        setPostsPage(page - 1);
                      } else {
                        setCommentsPage(page - 1);
                      }
                    }}
                  />
                </div>
              )}
          </div>

          <div className="col-start-2 row-start-2 self-start">
            <ActivityPointCard
              totalPoint={pointsQuery.data?.totalPoint ?? dashboard.point}
              activities={pointsQuery.data?.activities ?? []}
              isLoading={pointsQuery.isPending}
              errorMessage={
                pointsQuery.isError
                  ? getApiErrorMessage(
                      pointsQuery.error,
                      "포인트 내역을 불러오지 못했습니다.",
                    )
                  : undefined
              }
              onRetry={() => void pointsQuery.refetch()}
              onOpenBadgeGrade={() => setBadgeModal("grade")}
              onOpenBadgeHelp={() => setBadgeModal("help")}
            />
          </div>
        </div>
      </div>

      {badgeModal === "grade" && <BadgeGradeModal onClose={() => setBadgeModal(null)} />}
      {badgeModal === "help" && <BadgeHelpModal onClose={() => setBadgeModal(null)} />}
      <DeleteConfirmModal
        open={postToDelete !== null}
        title="게시글을 삭제하시겠어요?"
        description="삭제가 완료되면 고객님의 게시글이 즉시 삭제되며, 이는 복구할 수 없습니다."
        onCancel={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete) {
            void deletePostItem(postToDelete);
          }
        }}
        loading={deletingPostId !== null}
      />
      <DeleteConfirmModal
        open={commentToDelete !== null}
        title="댓글을 삭제하시겠어요?"
        description="삭제가 완료되면 고객님의 댓글이 즉시 삭제되며, 이는 복구할 수 없습니다."
        onCancel={() => setCommentToDelete(null)}
        onConfirm={() => {
          if (commentToDelete) {
            void deleteCommentItem(commentToDelete);
          }
        }}
        loading={deletingCommentId !== null}
      />
    </div>
  );
}
