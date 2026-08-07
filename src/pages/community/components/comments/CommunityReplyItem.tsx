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
                  <div className="absolute right-0 top-[32px] z-20 min-w-[80px] overflow-hidden rounded-[8px] border border-background-300 bg-background-100 py-[4px] shadow-md">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);

                        setEditedContent(reply.content);
                        setIsEditing(true);

                        onCancelReply();
                      }}
                      className="block w-full cursor-pointer px-[16px] py-[8px] text-left text-body-sub hover:bg-background-200"
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onDelete) return onDelete(reply.commentId);
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
          <div>
            {isEditing ? (
              <div className="mt-3">
                <textarea
                  value={editedContent}
                  maxLength={1000}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[80px] rounded-[8px] border border-background-300 bg-background-100 p-3 text-body text-background-600"
                />
                <div className="mt-2 flex gap-2">
                  <ButtonOutline
                    label="취소"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(reply.content);
                    }}
                  />
                  <ButtonFill
                    label="적용"
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
                <p className="mt-[8px] text-h6-list text-h3-onboard">{reply.content}</p>
                <div className="mt-[16px] flex items-center gap-[24px] text-body-sub text-background-500">
                  <HeartStat
                    count={reply.likeCount}
                    isActive={reply.isLiked}
                    disabled={likingCommentId === reply.commentId}
                    onClick={() => onLike(reply.commentId, reply.isLiked)}
                  />
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
        />
      ))}
    </div>
  );
}
