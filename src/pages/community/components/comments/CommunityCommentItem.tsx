import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import { showToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/apis/apiError";
import { useState } from "react";
import type { CommunityComment } from "@/types/community";
import CommunityReplyForm from "./CommunityReplyForm";
import CommunityReplyItem from "./CommunityReplyItem";
import { getRelativeTime } from "@/utils/time";
import { useUpdateCommunityComment } from "@/hooks/useCommunity";

interface CommunityCommentItemProps {
  postId: number;
  comment: CommunityComment;
  canAdopt?: boolean;
  replyTargetId: number | null;
  onSelectReplyTarget: (comment: CommunityComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentCommentId: number, content: string) => void;
  isReplyPending: boolean;
  onLike: (commentId: number, isCurrentlyLiked: boolean) => void;
  likingCommentId?: number;
  onAdopt?: (commentId: number, isAccepted: boolean) => void;
  isAdoptPending?: boolean;
  onDelete?: (commentId: number) => void;
}

export default function CommunityCommentItem({
  postId,
  comment,
  canAdopt = false,
  replyTargetId,
  onSelectReplyTarget,
  onCancelReply,
  onSubmitReply,
  isReplyPending,
  onLike,
  likingCommentId,
  onAdopt,
  isAdoptPending = false,
  onDelete,
}: CommunityCommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateCommunityComment(postId);

  const applyEdit = () => {
    const content = editedContent.trim();
    if (!content || isUpdating) return;

    updateComment(
      { commentId: comment.commentId, content },
      {
        onSuccess: () => {
          setIsEditing(false);
          showToast("green", "댓글이 수정되었습니다.");
        },
        onError: (err) => showToast("red", getApiErrorMessage(err, "댓글을 수정하지 못했습니다.")),
      },
    );
  };

  return (
    <li className="pt-[20px]">
      <div className="flex gap-[26.5px] border-b border-background-250 pb-[20px]">
        <ProfileIcon className="h-[40px] w-[40px] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <p className="text-h6 text-background-600">{comment.authorNickname || "익명"}</p>
              <time className="text-body-sub text-background-500">
                {getRelativeTime(comment.createdAt)}
              </time>
            </div>
            {comment.isMine && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="댓글 메뉴 열기"
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((p) => !p)}
                  className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] text-background-500 hover:bg-background-200"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">
                    ⋮
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-[32px] z-20 min-w-[80px] overflow-hidden rounded-[8px] border border-background-300 bg-background-100 py-[4px] shadow-md">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsEditing(true);
                      }}
                      className="block w-full cursor-pointer px-[16px] py-[8px] text-left text-body-sub hover:bg-background-200"
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (typeof onDelete === "function") onDelete(comment.commentId);
                      }}
                      className="block w-full cursor-pointer px-[16px] py-[8px] text-left text-body-sub text-sub-red hover:bg-background-200"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-3 pr-[14px]">
              <textarea
                value={editedContent}
                maxLength={1000}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[96px] w-full resize-none rounded-[8px] border border-background-300 bg-background-100 px-[16px] py-[12px] text-body text-background-600 outline-none focus:border-primary-500"
              />
              <div className="mt-[12px] flex justify-end gap-2">
                <ButtonOutline
                  label="취소"
                  className="!h-[25px] !text-h6"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                />
                <ButtonFill
                  label="적용"
                  className="!min-h-[25px] h-[26px] !text-h6"
                  onClick={applyEdit}
                  disabled={isUpdating || !editedContent.trim()}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="mt-[8px] text-h3-onboard text-background-600">{comment.content}</p>
              <div className="mt-[10px] flex items-center gap-[24px] text-body-sub text-background-500">
                {canAdopt ? (
                  <HeartStat
                    count={comment.likeCount}
                    isActive={comment.isAccepted}
                    disabled={isAdoptPending}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onAdopt?.(comment.commentId, comment.isAccepted);
                    }}
                    label="채택"
                  />
                ) : (
                  <HeartStat
                    count={comment.likeCount}
                    isActive={comment.isLiked}
                    disabled={likingCommentId === comment.commentId}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onLike(comment.commentId, comment.isLiked);
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onSelectReplyTarget(comment);
                  }}
                  className="cursor-pointer"
                >
                  답글 달기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {replyTargetId === comment.commentId && (
        <CommunityReplyForm
          targetAuthor={comment.authorNickname || "익명"}
          isSubmitting={isReplyPending}
          onCancel={onCancelReply}
          onSubmit={(content) => onSubmitReply(comment.commentId, content)}
        />
      )}

      {comment.replies?.map((replyItem) => (
        <CommunityReplyItem
          key={replyItem.commentId}
          postId={postId}
          reply={replyItem}
          replyTargetId={replyTargetId}
          onSelectReplyTarget={onSelectReplyTarget}
          onCancelReply={onCancelReply}
          onSubmitReply={onSubmitReply}
          isReplyPending={isReplyPending}
          onLike={onLike}
          likingCommentId={likingCommentId}
          onDelete={onDelete}
          canAdopt={canAdopt}
          onAdopt={onAdopt}
          isAdoptPending={isAdoptPending}
        />
      ))}
    </li>
  );
}
