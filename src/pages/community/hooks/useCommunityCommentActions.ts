import { useCallback, useMemo, useState } from "react";

import { showToast } from "@/components/Toast";
import {
  useCreateCommunityComment,
  useCreateCommunityReply,
  useDeleteCommunityComment,
  useToggleCommunityCommentAdoption,
  useToggleCommunityCommentLike,
  useUpdateCommunityComment,
} from "@/hooks/useCommunity";
import type { CommunityComment } from "@/types/community";

import type { CommunityCommentsContextValue } from "../components/comments/CommunityCommentsContext";
import useCommunityMutationError from "./useCommunityMutationError";

interface UseCommunityCommentActionsParams {
  postId: number;
  canAdopt: boolean;
  onLoginRequired: () => void;
}

export function useCommunityCommentActions({
  postId,
  canAdopt,
  onLoginRequired,
}: UseCommunityCommentActionsParams) {
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const showMutationError = useCommunityMutationError(onLoginRequired);
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
  const {
    mutate: updateComment,
    isPending: isUpdatePending,
    variables: updatingComment,
  } = useUpdateCommunityComment(postId);

  const submitComment = useCallback(
    (content: string, onSuccess: () => void) => {
      if (isCreatePending) return;

      createComment(
        { content },
        {
          onSuccess,
          onError: (error) => showMutationError(error, "댓글을 등록하지 못했습니다."),
        },
      );
    },
    [createComment, isCreatePending, showMutationError],
  );

  const selectReplyTarget = useCallback((comment: CommunityComment) => {
    setReplyTargetId((current) =>
      current === comment.commentId ? null : comment.commentId,
    );
  }, []);
  const cancelReply = useCallback(() => setReplyTargetId(null), []);

  const submitReply = useCallback(
    (parentCommentId: number, content: string) => {
      if (isReplyPending) return;

      createReply(
        { content, parentCommentId },
        {
          onSuccess: cancelReply,
          onError: (error) => showMutationError(error, "답글을 등록하지 못했습니다."),
        },
      );
    },
    [cancelReply, createReply, isReplyPending, showMutationError],
  );

  const likeComment = useCallback(
    (commentId: number, isCurrentlyLiked: boolean) => {
      toggleCommentLike(
        { commentId, isCurrentlyLiked },
        {
          onError: (error) =>
            showMutationError(error, "댓글 공감 상태를 변경하지 못했습니다."),
        },
      );
    },
    [showMutationError, toggleCommentLike],
  );

  const adoptComment = useCallback(
    (commentId: number, isAccepted: boolean) => {
      toggleCommentAdoption(commentId, {
        onSuccess: () => {
          showToast(
            "green",
            isAccepted ? "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.",
          );
        },
        onError: (error) => showMutationError(error, "댓글을 채택하지 못했습니다."),
      });
    },
    [showMutationError, toggleCommentAdoption],
  );

  const removeComment = useCallback(
    (commentId: number) => {
      deleteComment(commentId, {
        onError: (error) => showMutationError(error, "댓글을 삭제하지 못했습니다."),
      });
    },
    [deleteComment, showMutationError],
  );

  const editComment = useCallback(
    (commentId: number, content: string, onSuccess: () => void) => {
      updateComment(
        { commentId, content },
        {
          onSuccess: () => {
            onSuccess();
            showToast("green", "댓글을 수정했습니다.");
          },
          onError: (error) => showMutationError(error, "댓글을 수정하지 못했습니다."),
        },
      );
    },
    [showMutationError, updateComment],
  );

  const contextValue = useMemo<CommunityCommentsContextValue>(
    () => ({
      canAdopt,
      replyTargetId,
      isReplyPending,
      likingCommentId: isLikePending ? likingComment?.commentId : undefined,
      isAdoptPending,
      updatingCommentId: isUpdatePending ? updatingComment?.commentId : undefined,
      onSelectReplyTarget: selectReplyTarget,
      onCancelReply: cancelReply,
      onSubmitReply: submitReply,
      onLike: likeComment,
      onAdopt: adoptComment,
      onDelete: removeComment,
      onUpdate: editComment,
    }),
    [
      adoptComment,
      canAdopt,
      cancelReply,
      editComment,
      isAdoptPending,
      isLikePending,
      isReplyPending,
      isUpdatePending,
      likeComment,
      likingComment?.commentId,
      removeComment,
      replyTargetId,
      selectReplyTarget,
      submitReply,
      updatingComment?.commentId,
    ],
  );

  return { contextValue, isCreatePending, submitComment };
}
