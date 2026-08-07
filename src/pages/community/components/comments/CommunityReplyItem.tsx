import ProfileIcon from "@/assets/icons/Profile.svg?react";
import HeartStat from "@/components/post-stat/HeartStat";
import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import { showToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/apis/apiError";
import type { CommunityComment } from "@/types/community";
import CommunityReplyForm from "./CommunityReplyForm";
import { useState } from "react";
import { getRelativeTime } from "@/utils/time";
import { useUpdateCommunityComment } from "@/hooks/useCommunity";

interface CommunityReplyItemProps {
  postId: number;
  reply: CommunityComment;
  replyTargetId: number | null;
  onSelectReplyTarget: (comment: CommunityComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentCommentId: number, content: string) => void;
  isReplyPending: boolean;
  onLike: (commentId: number, isCurrentlyLiked: boolean) => void;
  likingCommentId?: number;
  onDelete?: (commentId: number) => void;
  canAdopt?: boolean;
  onAdopt?: (commentId: number, isAccepted: boolean) => void;
  isAdoptPending: boolean;
}

export default function CommunityReplyItem({
  postId,
  reply,
  replyTargetId,
  onSelectReplyTarget,
  onCancelReply,
  onSubmitReply,
  isReplyPending,
  onLike,
  likingCommentId,
  onDelete,
  canAdopt = false,
  onAdopt,
  isAdoptPending,
}: CommunityReplyItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateCommunityComment(postId);
  return (
    <div>
      <div className="border-b border-background-250">
        <div className="relative ml-[18px] py-[20px] pl-[48.5px] before:absolute before:left-0 before:top-[28px] before:h-[24px] before:w-[24px] before:border-b before:border-l before:border-background-300">
          <div className="flex min-w-0 items-center justify-between">
            <div className="flex min-w-0 items-center gap-[8px]">
              <ProfileIcon className="h-[24px] w-[24px] shrink-0" />
              <strong className="text-h6 text-background-600">
                {reply.authorNickname || "알 수 없는 사용자"}
              </strong>
              <time className="text-body-sub text-background-500">
                {getRelativeTime(reply.createdAt)}
              </time>
            </div>
            {reply.isMine && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="대댓글 메뉴 열기"
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((previous) => !previous)}
                  className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] text-background-500 hover:bg-background-200"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">
                    ⋮
                  </span>
                </button>

                {isMenuOpen && (
                  <div
                    role="menu"
                    aria-label="대댓글 메뉴"
                    className="absolute right-0 top-[32px] z-20 min-w-[140px] overflow-hidden rounded-[10px] border border-background-300 bg-background-100 py-1 shadow-md"
                  >
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsEditing(true);

                        onCancelReply();
                      }}
                      className="block w-full px-4 py-2 text-left text-body-sub text-background-600 hover:bg-background-200 focus:bg-background-200"
                    >
                      수정
                    </button>

                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onDelete) onDelete(reply.commentId);
                      }}
                      className="block w-full px-4 py-2 text-left text-body-sub text-sub-red hover:bg-background-200 focus:bg-background-200"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
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
                      setEditedContent(reply.content);
                    }}
                  />
                  <ButtonFill
                    label="적용"
                    className="!min-h-[25px] h-[26px] !text-h6"
                    onClick={() => {
                      const content = editedContent.trim();
                      if (!content || isUpdating) return;

                      updateComment(
                        { commentId: reply.commentId, content },
                        {
                          onSuccess: () => {
                            setEditedContent(content);
                            setIsEditing(false);
                            showToast("green", "댓글이 수정되었습니다.");
                          },
                          onError: (err) =>
                            showToast(
                              "red",
                              getApiErrorMessage(err, "댓글을 수정하지 못했습니다."),
                            ),
                        },
                      );
                    }}
                    disabled={isUpdating || !editedContent.trim()}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="mt-[8px] text-h3-onboard">{reply.content}</p>
                <div className="mt-[16px] flex items-center gap-[24px] text-body-sub text-background-500">
                  {canAdopt ? (
                    <HeartStat
                      count={reply.likeCount}
                      isActive={reply.isAccepted}
                      disabled={isAdoptPending}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onAdopt?.(reply.commentId, reply.isAccepted);
                      }}
                      label="채택"
                    />
                  ) : (
                    <HeartStat
                      count={reply.likeCount}
                      isActive={reply.isLiked}
                      disabled={likingCommentId === reply.commentId}
                      onClick={() => onLike(reply.commentId, reply.isLiked)}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectReplyTarget(reply)}
                    className="cursor-pointer"
                  >
                    답글 달기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!isEditing && replyTargetId === reply.commentId && (
        <CommunityReplyForm
          targetAuthor={reply.authorNickname || "알 수 없는 사용자"}
          isSubmitting={isReplyPending}
          onCancel={onCancelReply}
          onSubmit={(content) => onSubmitReply(reply.commentId, content)}
        />
      )}

      {reply.replies?.map((nestedReply) => (
        <CommunityReplyItem
          key={nestedReply.commentId}
          postId={postId}
          reply={nestedReply}
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
    </div>
  );
}
