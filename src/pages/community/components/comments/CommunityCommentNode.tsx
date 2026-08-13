import { memo, useEffect, useRef, useState } from "react";

import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import HeartStat from "@/components/post-stat/HeartStat";
import ProfileAvatar from "@/components/ProfileAvatar";
import { showToast } from "@/components/Toast";
import type { CommunityComment } from "@/types/community";
import { getRelativeTime } from "@/utils/time";

import { CommunityTextarea } from "../CommunityContentFields";
import { useCommunityCommentsContext } from "./CommunityCommentsContext";
import CommunityReplyForm from "./CommunityReplyForm";

export interface CommunityCommentNodeProps {
  comment: CommunityComment;
  depth?: number;
}

function CommunityCommentNode({ comment, depth = 0 }: CommunityCommentNodeProps) {
  const {
    canAdopt,
    replyTargetId,
    onSelectReplyTarget,
    onCancelReply,
    onSubmitReply,
    isReplyPending,
    onLike,
    likingCommentId,
    onAdopt,
    isAdoptPending,
    onDelete,
    onUpdate,
    updatingCommentId,
  } = useCommunityCommentsContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const isUpdating = updatingCommentId === comment.commentId;
  const isRoot = depth === 0;
  const isDeleted = comment.status === "DELETED";
  const isReplyFormOpen = !isDeleted && !isEditing && replyTargetId === comment.commentId;
  const authorName =
    comment.authorNickname?.trim() || (isDeleted ? "삭제된 사용자" : "익명");
  const profileImage = (
    <ProfileAvatar
      imageUrl={comment.profileImageUrl}
      alt={`${authorName} 프로필`}
      className={isRoot ? "h-[40px] w-[40px]" : "h-[24px] w-[24px]"}
    />
  );

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuContainerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setIsMenuOpen(false);
      menuTriggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const startEditing = () => {
    setIsMenuOpen(false);
    setEditedContent(comment.content);
    setIsEditing(true);
    onCancelReply();
  };

  const applyEdit = () => {
    const content = editedContent.trim();
    if (!content || isUpdating) return;

    onUpdate(comment.commentId, content, () => {
      setEditedContent(content);
      setIsEditing(false);
    });
  };

  const nodeContent = (
    <div
      className={
        isRoot
          ? `flex gap-[28px] pb-[20px] ${isReplyFormOpen ? "" : "border-b border-background-250"}`
          : `relative ml-[20px] py-[20px] pl-[48px] before:absolute before:left-0 before:top-[28px] before:h-[24px] before:w-[24px] before:border-b before:border-l before:border-background-300 ${isReplyFormOpen ? "" : "after:absolute after:bottom-0 after:left-[-20px] after:right-0 after:border-b after:border-background-250"}`
      }
    >
      {isRoot && profileImage}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between">
          <div className="flex min-w-0 items-center gap-[8px]">
            {!isRoot && profileImage}
            <p className="truncate text-h6 text-background-600">{authorName}</p>
            <time className="shrink-0 text-body-sub text-background-500">
              {getRelativeTime(comment.createdAt)}
            </time>
          </div>

          {!isDeleted && comment.isMine && (
            <div ref={menuContainerRef} className="relative">
              <button
                ref={menuTriggerRef}
                type="button"
                aria-label={`${isRoot ? "댓글" : "답글"} 메뉴 열기`}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((current) => !current)}
                className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-[6px] text-background-500 hover:bg-background-200"
              >
                <span aria-hidden="true" className="text-[18px] leading-none">
                  ⋮
                </span>
              </button>

              {isMenuOpen && (
                <div
                  role="menu"
                  aria-label={`${isRoot ? "댓글" : "답글"} 메뉴`}
                  className="absolute right-0 top-[32px] z-20 min-w-[140px] overflow-hidden rounded-[10px] border border-background-300 bg-background-100 py-1 shadow-md"
                >
                  <button
                    role="menuitem"
                    type="button"
                    onClick={startEditing}
                    className="block w-full px-4 py-2 text-left text-body-sub text-background-600 hover:bg-background-200 focus:bg-background-200"
                  >
                    수정
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete(comment.commentId);
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

        {isDeleted ? (
          <p className="mt-[8px] text-h3-onboard text-background-500">삭제된 댓글입니다.</p>
        ) : isEditing ? (
          <div className="mt-3 pr-[14px]">
            <CommunityTextarea
              value={editedContent}
              onChange={setEditedContent}
              placeholder="댓글을 입력해 주세요"
              placeholderClassName="placeholder:text-h3-onboard"
              ariaLabel={`${isRoot ? "댓글" : "답글"} 내용`}
              compact
              onEnter={applyEdit}
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
            <div className="mt-[16px] flex items-center gap-[24px] text-body-sub text-background-500">
              {!canAdopt && (
                <HeartStat
                  count={comment.likeCount}
                  isActive={comment.isLiked}
                  disabled={likingCommentId === comment.commentId}
                  onClick={(event) => {
                    event?.stopPropagation();
                    onLike(comment.commentId, comment.isLiked);
                  }}
                />
              )}
              {canAdopt && (
                <HeartStat
                  isActive={comment.isAccepted}
                  disabled={isAdoptPending}
                  onClick={(event) => {
                    event?.stopPropagation();

                    if (comment.isMine && !comment.isAccepted) {
                      showToast("red", "본인이 작성한 댓글 혹은 답글은 채택할 수 없습니다.");
                      return;
                    }

                    onAdopt(comment.commentId, comment.isAccepted);
                  }}
                  label="채택"
                  ariaLabel={comment.isAccepted ? "댓글 채택 취소" : "댓글 채택"}
                />
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectReplyTarget(comment);
                }}
                className="inline-flex h-5 cursor-pointer items-center justify-center leading-none"
              >
                답글 달기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const replyForm = isReplyFormOpen && (
    <CommunityReplyForm
      targetAuthor={authorName}
      isSubmitting={isReplyPending}
      onCancel={onCancelReply}
      onSubmit={(content) => onSubmitReply(comment.commentId, content)}
    />
  );

  const replies = comment.replies?.map((reply) => (
    <CommunityCommentNode key={reply.commentId} comment={reply} depth={depth + 1} />
  ));

  return isRoot ? (
    <li className="pt-[20px]">
      {nodeContent}
      {replyForm}
      {replies}
    </li>
  ) : (
    <div>
      {nodeContent}
      {replyForm}
      {replies}
    </div>
  );
}

export default memo(CommunityCommentNode);
