import { useCommunityComments } from "@/hooks/useCommunity";
import { useCommunityCommentActions } from "../../hooks/useCommunityCommentActions";
import CommentEmptyState from "./CommentEmptyState";
import CommunityCommentForm from "./CommunityCommentForm";
import CommunityCommentNode from "./CommunityCommentNode";
import { CommunityCommentsContext } from "./CommunityCommentsContext";

interface CommunityCommentsSectionProps {
  postId: number;
  canAdopt?: boolean;
  onLoginRequired: () => void;
}

export default function CommunityCommentsSection({
  postId,
  canAdopt = false,
  onLoginRequired,
}: CommunityCommentsSectionProps) {
  const { data, isPending, isError } = useCommunityComments(postId);
  const { contextValue, isCreatePending, submitComment } = useCommunityCommentActions({
    postId,
    canAdopt,
    onLoginRequired,
  });
  const comments = data?.comments ?? [];

  return (
    <section className="pt-[16px]">
      <p className="text-h2-list text-background-600">
        댓글 <span className="ml-[8px] text-main-400">{data?.totalCount ?? 0}</span>
      </p>

      <CommunityCommentForm isSubmitting={isCreatePending} onSubmit={submitComment} />

      {isPending ? (
        <div className="py-10 text-center text-background-500">댓글을 불러오는 중입니다.</div>
      ) : isError ? (
        <p className="py-10 text-center text-background-500">댓글을 불러오지 못했습니다.</p>
      ) : comments.length === 0 ? (
        <CommentEmptyState />
      ) : (
        <CommunityCommentsContext.Provider value={contextValue}>
          <ul className="mt-[18px]">
            {comments.map((item) => (
              <CommunityCommentNode key={item.commentId} comment={item} />
            ))}
          </ul>
        </CommunityCommentsContext.Provider>
      )}
    </section>
  );
}
