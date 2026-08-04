import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/apis/apiError";
import {
  deleteMyScrap,
  getMyComments,
  getMyDashboard,
  getMyPoints,
  getMyPosts,
  getMyScraps,
  USER_DASHBOARD_QUERY_KEY,
  USER_SCRAPS_QUERY_KEY,
} from "@/apis/userApi";
import Pagination from "@/components/pagination/Pagination";
import { showToast } from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import ActivityPointCard from "./components/ActivityPointCard";
import BadgeGradeModal from "./components/BadgeGradeModal";
import BadgeHelpModal from "./components/BadgeHelpModal";
import MyPageCard from "./components/MyPageCard";
import MyPageTabs from "./components/MyPageTabs";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import type { MyPageScrapItem, MyPageTabKey } from "./types";

type BadgeModalType = "grade" | "help" | null;
const MY_ACTIVITY_PAGE_SIZE = 6;

function formatPostDate(createdAt: string) {
  return createdAt.slice(0, 10).replaceAll("-", ".");
}

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dashboardQuery = useQuery({
    queryKey: USER_DASHBOARD_QUERY_KEY,
    queryFn: getMyDashboard,
    retry: false,
  });
  const pointsQuery = useQuery({
    queryKey: ["user", "points"],
    queryFn: getMyPoints,
    retry: false,
  });
  const [activeTab, setActiveTab] = useState<MyPageTabKey>("saved");
  const [scrapsPage, setScrapsPage] = useState(0);
  const scrapsQuery = useQuery({
    queryKey: [...USER_SCRAPS_QUERY_KEY, scrapsPage, MY_ACTIVITY_PAGE_SIZE],
    queryFn: () => getMyScraps(scrapsPage, MY_ACTIVITY_PAGE_SIZE),
    enabled: activeTab === "saved",
    retry: false,
  });
  const [postsPage, setPostsPage] = useState(0);
  const postsQuery = useQuery({
    queryKey: ["user", "posts", postsPage, MY_ACTIVITY_PAGE_SIZE],
    queryFn: () => getMyPosts(postsPage, MY_ACTIVITY_PAGE_SIZE),
    enabled: activeTab === "posts",
    retry: false,
  });
  const [commentsPage, setCommentsPage] = useState(0);
  const commentsQuery = useQuery({
    queryKey: ["user", "comments", commentsPage, MY_ACTIVITY_PAGE_SIZE],
    queryFn: () => getMyComments(commentsPage, MY_ACTIVITY_PAGE_SIZE),
    enabled: activeTab === "comments",
    retry: false,
  });
  const [hiddenScrapIds, setHiddenScrapIds] = useState<Set<number | string>>(
    () => new Set(),
  );
  const [deletingScrapId, setDeletingScrapId] = useState<number | string | null>(
    null,
  );
  const [badgeModal, setBadgeModal] = useState<BadgeModalType>(null);

  const deleteItem = async (item: MyPageScrapItem) => {
    if (deletingScrapId !== null) {
      return;
    }

    setDeletingScrapId(item.id);

    try {
      await deleteMyScrap(item.scrapId);
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

  if (dashboardQuery.isPending) {
    return (
      <div
        role="status"
        className="flex min-h-full items-center justify-center bg-background-200 text-h3-onboard text-background-500"
      >
        마이페이지 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div
        role="alert"
        className="flex min-h-full flex-col items-center justify-center gap-[16px] bg-background-200 text-h3-onboard text-background-500"
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
            title: scrap.name,
            targetPath: `/info/${scrap.mainCategory}/${scrap.infoItemId}`,
            sourceLabel: scrap.mainCategoryKo || "정보",
            date: formatPostDate(scrap.scrappedAt),
          },
          scrappedAt: scrap.scrappedAt,
        })),
        ...scrapsQuery.data.newsScraps.map((scrap) => ({
          item: {
            id: `news-${scrap.scrapId}`,
            postId: scrap.newsId,
            type: "scrap" as const,
            scrapId: scrap.scrapId,
            title: scrap.title,
            targetPath: `/news/${scrap.newsId}`,
            sourceLabel: "소식",
            date: formatPostDate(scrap.scrappedAt),
          },
          scrappedAt: scrap.scrappedAt,
        })),
        ...scrapsQuery.data.postScraps.map((scrap) => ({
          item: {
            id: `post-${scrap.scrapId}`,
            postId: scrap.postId,
            type: "scrap" as const,
            scrapId: scrap.scrapId,
            title: scrap.title,
            targetPath: `/community/${scrap.postId}`,
            sourceLabel: "커뮤니티 게시글",
            date: formatPostDate(scrap.scrappedAt),
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
        date: formatPostDate(post.createdAt),
      }))
    : activeTab === "comments"
      ? (commentsQuery.data?.comments ?? []).map((comment) => ({
          id: comment.commentId,
          postId: comment.postId,
          type: "comment" as const,
          comment: comment.content,
          postTitle: comment.postTitle,
          date: formatPostDate(comment.createdAt),
        }))
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
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
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
              <div className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500">
                {activeTab === "saved"
                  ? "저장한 정보를 불러오는 중입니다."
                  : activeTab === "posts"
                    ? "작성한 게시글을 불러오는 중입니다."
                    : "작성한 댓글을 불러오는 중입니다."}
              </div>
            )}

            {activityError && (
              <div className="flex h-[144px] flex-col items-center justify-center gap-[12px] rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500">
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
                onDelete={
                  activeTab === "saved" && item.type === "scrap"
                    ? () => void deleteItem(item)
                    : undefined
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
    </div>
  );
}
