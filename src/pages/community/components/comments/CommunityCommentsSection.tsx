import { useState } from "react";

import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import ButtonFill from "@/components/ButtonFill";
import { showToast } from "@/components/Toast";
import {
  useCommunityComments,
  useCreateCommunityComment,
  useCreateCommunityReply,
  useToggleCommunityCommentLike,
  useToggleCommunityCommentAdoption,
  useDeleteCommunityComment,
} from "@/hooks/useCommunity";
import CommentEmptyState from "./CommentEmptyState";
import CommunityCommentItem from "./CommunityCommentItem";

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
  const [comment, setComment] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const { data, isPending, isError, refetch } = useCommunityComments(postId);
  const { mutate: createComment, isPending: isCreatePending } = useCreateCommunityComment(postId);
  const { mutate: createReply, isPending: isReplyPending } = useCreateCommunityReply(postId);
  const {
    mutate: toggleCommentLike,
    isPending: isLikePending,
    variables: likingComment,
  } = useToggleCommunityCommentLike(postId);
  const { mutate: toggleCommentAdoption, isPending: isAdoptPending } =
    useToggleCommunityCommentAdoption(postId);
  const { mutate: deleteComment } = useDeleteCommunityComment(postId);
  const comments = data?.comments ?? [];

  const showMutationError = (error: unknown, fallbackMessage: string) => {
    if (isUnauthorizedError(error)) {
      onLoginRequired();
      return;
    }

    showToast("red", getApiErrorMessage(error, fallbackMessage));
  };

  const submitComment = () => {
    const content = comment.trim();
    if (!content || isCreatePending) return;

    createComment(
      { content },
      {
        onSuccess: () => setComment(""),
        onError: (error) => showMutationError(error, "댓글을 등록하지 못했습니다."),
      },
    );
  };

  const submitReply = (parentCommentId: number, content: string) => {
    if (isReplyPending) return;

    createReply(
      { content, parentCommentId },
      {
        onSuccess: () => setReplyTargetId(null),
        onError: (error) => showMutationError(error, "답글을 등록하지 못했습니다."),
      },
    );
  };

  const likeComment = (commentId: number, isCurrentlyLiked: boolean) => {
    toggleCommentLike(
      { commentId, isCurrentlyLiked },
      {
        onError: (error) =>
          showMutationError(error, "댓글 공감 상태를 변경하지 못했습니다."),
      },
    );
  };

  return (
    <section className="pt-[16px]">
      <p className="text-h2-list text-background-600">
        댓글 <span className="ml-[8px] text-main-400">{data?.totalCount ?? 0}</span>
      </p>

      <form
        className="mt-[16px] flex items-center gap-[26.5px]"
        onSubmit={(event) => {
          event.preventDefault();
          submitComment();
        }}
      >
        <ProfileIcon className="h-[40px] w-[40px] shrink-0" />
        <input
          value={comment}
          maxLength={1000}
          disabled={isCreatePending}
          onChange={(event) => setComment(event.target.value)}
          placeholder="이웃 부모에게 따뜻한 댓글을 남겨주세요"
          className="h-[44px] w-[947px] flex-1 rounded-[10px] border border-transparent bg-background-200 px-[16px] text-h4-list text-background-600 outline-none placeholder:text-background-500 focus:border-main-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <ButtonFill
          type="submit"
          label="등록"
          disabled={!comment.trim() || isCreatePending}
          className="!h-[44px]"
        />
      </form>
      <p className="mt-2 pl-[66.5px] text-body-sub text-background-400">
        욕설·비방·광고성 링크가 포함된 댓글은 별도 안내 없이 삭제될 수 있습니다.
      </p>

      {isPending ? (
        <div className="py-10 text-center text-background-500">댓글을 불러오는 중입니다.</div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-background-500">
          <p>댓글을 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-background-300 px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : comments.length === 0 ? (
        <CommentEmptyState />
      ) : (
        <ul className="mt-[18px]">
          {comments.map((item) => (
            <CommunityCommentItem
              key={item.commentId}
              postId={postId}
              comment={item}
              canAdopt={canAdopt}
              replyTargetId={replyTargetId}
              onSelectReplyTarget={(targetComment) =>
                setReplyTargetId((current) =>
                  current === targetComment.commentId ? null : targetComment.commentId,
                )
              }
              onCancelReply={() => setReplyTargetId(null)}
              onSubmitReply={submitReply}
              isReplyPending={isReplyPending}
              onLike={likeComment}
              likingCommentId={isLikePending ? likingComment?.commentId : undefined}
              onLoginRequired={onLoginRequired}
              onAdopt={(commentId, isAccepted) =>
                toggleCommentAdoption(commentId, {
                  onSuccess: () => {
                    showToast(
                      "green",
                      isAccepted ? "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.",
                    );
                  },
                  onError: (error) => showMutationError(error, "댓글을 채택하지 못했습니다."),
                })
              }
              isAdoptPending={isAdoptPending}
              onDelete={(commentId: number) =>
                deleteComment(commentId, {
                  onError: (error: unknown) =>
                    showMutationError(error, "댓글을 삭제하지 못했습니다."),
                })
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}
