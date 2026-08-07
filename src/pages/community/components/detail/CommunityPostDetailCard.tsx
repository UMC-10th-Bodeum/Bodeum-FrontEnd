import type { ReactNode } from "react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import { getApiErrorMessage } from "@/apis/apiError";
import DetailBackButton from "@/components/DetailBackButton";
import { useNavigate } from "react-router-dom";
import PostTag from "@/components/PostTag";
import { showToast } from "@/components/Toast";
import { communityCategoryMap, type CommunityCategory } from "@/constants/communityCategory";
import {
  useToggleCommunityPostLike,
  useToggleCommunityPostScrap,
  useDeleteCommunityPost,
} from "@/hooks/useCommunity";
import { useUpdateCommunityPost } from "@/hooks/useCommunity";
import { useState } from "react";
import ButtonOutline from "@/components/ButtonOutline";
import ButtonFill from "@/components/ButtonFill";
import DeleteConfirmModal from "@/pages/community/components/detail/DeleteConfirmModal";
import type { CommunityPostDetail } from "@/types/community";
import ShareButton from "@/components/ShareButton";
import { diagnosisMap } from "@/constants/diagnosis";

interface CommunityPostDetailCardProps {
  post: CommunityPostDetail;
  category: CommunityCategory;
  children: ReactNode;
}

export default function CommunityPostDetailCard({
  post,
  category,
  children,
}: CommunityPostDetailCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [appliedTitle, setAppliedTitle] = useState(post.title);
  const [appliedContent, setAppliedContent] = useState(post.content);
  const { mutate: toggleLike, isPending: isLikePending } = useToggleCommunityPostLike(post.postId);
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleCommunityPostScrap(
    post.postId,
  );
  const navigate = useNavigate();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteCommunityPost(post.postId);
  const { mutate: updatePost, isPending: isUpdating } = useUpdateCommunityPost(post.postId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const startEditing = () => {
    setEditedTitle(appliedTitle);
    setEditedContent(appliedContent);
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onApply = () => {
    const payload = {
      boardType: post.boardType,
      anonymityType: post.anonymityType,
      title: editedTitle.trim() || appliedTitle,
      content: editedContent,
      disabilityTypes: post.disabilityTypes,
      hashtags: post.hashtags,
      imageUrls: post.imageUrls,
    };

    updatePost(payload, {
      onSuccess: (updated) => {
        setAppliedTitle(updated.title ?? payload.title);
        setAppliedContent(updated.content ?? payload.content);
        setIsEditing(false);
        showToast("green", "게시글이 수정되었습니다.");
      },
      onError: (error) =>
        showToast("red", getApiErrorMessage(error, "게시글을 수정하지 못했습니다.")),
    });
  };

  const nameLineItems = [
    `${post.authorNickname ?? "알 수 없는 사용자"}님`,
    ...post.disabilityTypes.map((type) => diagnosisMap[type].label),
  ];

  return (
    <article className="min-h-[574px] rounded-[18px] border border-background-250 bg-background-100 px-[40px] py-[20px]">
      <header className="flex items-center justify-between border-b border-background-250 pb-[20px]">
        <div className="flex min-w-0 items-center gap-[12px] [&>span:first-child]:!h-[20px]">
          <PostTag type="ETC" label={communityCategoryMap[category]} />
          <div className="flex min-w-0 items-center gap-[2px] truncate text-body-sub text-background-500">
            {nameLineItems.map((item, index) => (
              <span key={index} className="flex items-center gap-[2px]">
                {index > 0 && <span aria-hidden="true">·</span>}
                {item}
              </span>
            ))}
          </div>
        </div>
        <time className="shrink-0 text-body-sub text-background-400">
          {new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(post.createdAt))}
        </time>
      </header>

      <div className="pb-[20px] pt-[12px]">
        {isEditing ? (
          <>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full rounded-[6px] border border-background-200 px-3 py-2 text-h1-onboard"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mt-[12px] w-full min-h-[120px] rounded-[6px] border border-background-200 p-3 text-h3-onboard"
            />
          </>
        ) : (
          <>
            <h1 className="text-h1-onboard text-background-600">{appliedTitle}</h1>
            <p className="mt-[12px] whitespace-pre-wrap text-h3-onboard text-background-600">
              {appliedContent}
            </p>
          </>
        )}

        {post.imageUrls.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {post.imageUrls.map((imageUrl, index) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`${post.title} 첨부 이미지 ${index + 1}`}
                className="max-h-[360px] w-full rounded-[10px] object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-background-250 py-[16px]">
        <div className="flex items-center gap-[10px]">
          <DetailBackButton
            icon={post.isLiked ? HeartIcon : HeartDisabledIcon}
            label={`공감 ${post.likeCount}`}
            className="h-[36px]"
            selected={post.isLiked}
            selectedClassName="border-sub-red text-sub-red"
            disabled={isLikePending}
            onClick={() =>
              toggleLike(post.isLiked, {
                onError: (error) =>
                  showToast("red", getApiErrorMessage(error, "공감 상태를 변경하지 못했습니다.")),
              })
            }
          />
          <DetailBackButton
            icon={post.isScrapped ? ScrapPressedIcon : ScrapIcon}
            label="스크랩"
            className="h-[36px]"
            selected={post.isScrapped}
            selectedClassName="border-sub-yellow text-sub-yellow"
            disabled={isScrapPending}
            onClick={() =>
              toggleScrap(post.isScrapped, {
                onError: (error) =>
                  showToast("red", getApiErrorMessage(error, "스크랩 상태를 변경하지 못했습니다.")),
              })
            }
          />

          <ShareButton
            url={window.location.href}
            className="!border-background-300 !text-background-500 !h-[36px]"
          />
        </div>

        <div className="flex items-center gap-2">
          {post.isMine && (
            <>
              {isEditing ? (
                <div className="ml-auto flex gap-[8px]">
                  <ButtonOutline
                    label="취소하기"
                    onClick={onCancel}
                    className="w-[88px] !h-[36px]"
                  />
                  <ButtonFill
                    label="적용하기"
                    disabled={editedTitle.trim().length === 0 || isUpdating}
                    onClick={onApply}
                    className="w-[88px] !min-h-[36px] h-[36px]"
                  />
                </div>
              ) : (
                <ButtonOutline
                  label="수정"
                  onClick={startEditing}
                  className="ml-auto !h-[36px] px-[20px] !py-[8px]"
                />
              )}

              <DetailBackButton
                icon={null}
                label="삭제"
                tone="danger"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(true)}
                className="h-[36px] px-[20px] py-[8px]"
              />

              <DeleteConfirmModal
                open={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() =>
                  deletePost(post.postId, {
                    onSuccess: () => {
                      showToast("green", "게시물이 삭제되었습니다.");
                      navigate("/community");
                    },
                    onError: (error) =>
                      showToast("red", getApiErrorMessage(error, "게시물을 삭제하지 못했습니다.")),
                  })
                }
                loading={isDeleting}
              />
            </>
          )}
        </div>
      </div>

      {children}
    </article>
  );
}
