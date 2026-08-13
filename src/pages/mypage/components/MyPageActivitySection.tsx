import { getApiErrorMessage } from "@/apis/apiError";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Pagination from "@/components/pagination/Pagination";
import type { MyPageTabKey } from "@/types/mypage";
import { useMyPageActivities } from "../hooks/useMyPageActivities";
import MyPageCard from "./MyPageCard";
import MyPageTabs from "./MyPageTabs";

interface MyPageActivitySectionProps {
  counts: Record<MyPageTabKey, number>;
}

const pendingMessage: Record<MyPageTabKey, string> = {
  saved: "저장한 정보를 불러오는 중입니다.",
  posts: "작성한 게시글을 불러오는 중입니다.",
  comments: "작성한 댓글을 불러오는 중입니다.",
};

const errorMessage: Record<MyPageTabKey, string> = {
  saved: "저장한 정보를 불러오지 못했습니다.",
  posts: "작성한 게시글을 불러오지 못했습니다.",
  comments: "작성한 댓글을 불러오지 못했습니다.",
};

export default function MyPageActivitySection({ counts }: MyPageActivitySectionProps) {
  const activity = useMyPageActivities();

  return (
    <>
      <section className="col-start-1 row-start-1">
        <MyPageTabs
          activeTab={activity.activeTab}
          counts={counts}
          onChange={activity.setActiveTab}
        />
      </section>

      <div className="col-start-1 row-start-2 flex flex-col gap-[8px]">
        {activity.isPending && (
          <div
            role="status"
            className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500"
          >
            {pendingMessage[activity.activeTab]}
          </div>
        )}

        {activity.error && (
          <div
            role="alert"
            className="flex h-[144px] flex-col items-center justify-center gap-[12px] rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500"
          >
            <p>{getApiErrorMessage(activity.error, errorMessage[activity.activeTab])}</p>
            <button
              type="button"
              onClick={activity.retry}
              className="cursor-pointer text-main-400 underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {!activity.isPending &&
          !activity.error &&
          activity.items.map((item) => (
            <MyPageCard
              key={item.id}
              item={item}
              deleteDisabled={activity.deleteDisabled}
              onDelete={() => activity.requestDelete(item)}
            />
          ))}

        {!activity.isPending && !activity.error && activity.items.length === 0 && (
          <div className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500">
            표시할 항목이 없습니다.
          </div>
        )}

        {activity.totalPages > 1 && (
          <div className="mt-[12px] flex justify-center">
            <Pagination
              currentPage={activity.currentPage + 1}
              totalPages={activity.totalPages}
              onChange={(page) => activity.setPage(page - 1)}
            />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={activity.postToDelete !== null}
        title="게시글을 삭제하시겠어요?"
        description="삭제가 완료되면 고객님의 게시글이 즉시 삭제되며, 이는 복구할 수 없습니다."
        onCancel={activity.cancelPostDelete}
        onConfirm={activity.confirmPostDelete}
        loading={activity.isDeletingPost}
      />
      <DeleteConfirmModal
        open={activity.commentToDelete !== null}
        title="댓글을 삭제하시겠어요?"
        description="삭제가 완료되면 고객님의 댓글이 즉시 삭제되며, 이는 복구할 수 없습니다."
        onCancel={activity.cancelCommentDelete}
        onConfirm={activity.confirmCommentDelete}
        loading={activity.isDeletingComment}
      />
    </>
  );
}
