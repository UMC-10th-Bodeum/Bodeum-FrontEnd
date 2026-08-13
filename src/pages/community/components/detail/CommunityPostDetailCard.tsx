import { useState, type ReactNode } from "react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import WarningIcon from "@/assets/icons/Warning.svg?react";
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
import ButtonOutline from "@/components/ButtonOutline";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import type { CommunityPostDetail } from "@/types/community";
import ShareButton from "@/components/ShareButton";
import { diagnosisMap } from "@/constants/diagnosis";
import { formatDate } from "@/utils/time";
import useCommunityMutationError from "../../hooks/useCommunityMutationError";

interface CommunityPostDetailCardProps {
  post: CommunityPostDetail;
  category: CommunityCategory;
  children: ReactNode;
  onLoginRequired: () => void;
}

interface ImageThumbProps {
  src: string;
  alt: string;
  className?: string;
}

function ImageThumb({ src, alt, className }: ImageThumbProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] bg-background-150${className ? ` ${className}` : ""}`}
    >
      {status === "error" ? (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 text-body-sub text-background-400"
          role="img"
          aria-label={alt}
        >
          <WarningIcon className="h-6 w-6" />
          <span>이미지를 불러올 수 없습니다.</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`h-full w-full object-cover transition-opacity ${status === "loading" ? "opacity-0" : "opacity-100"}`}
        />
      )}
    </div>
  );
}

export default function CommunityPostDetailCard({
  post,
  category,
  children,
  onLoginRequired,
}: CommunityPostDetailCardProps) {
  const { mutate: toggleLike, isPending: isLikePending } = useToggleCommunityPostLike(post.postId);
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleCommunityPostScrap(
    post.postId,
  );
  const navigate = useNavigate();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteCommunityPost(post.postId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showMutationError = useCommunityMutationError(onLoginRequired, () =>
    setShowDeleteModal(false),
  );

  const isFullyAnonymous = post.anonymityType === "FULLY_ANONYMOUS";
  const authorName =
    post.authorNickname?.trim() || (post.authorId === null ? "탈퇴한 사용자" : "사용자");
  const authorDisplayName = post.authorId === null ? authorName : `${authorName}님`;
  const disabilityLabels = post.disabilityTypes
    .map((type) => diagnosisMap[type]?.label)
    .filter((label): label is string => Boolean(label));
  const nameLineItems = isFullyAnonymous
    ? ["익명"]
    : [
        authorDisplayName,
        post.authorLevel !== null ? `Level${post.authorLevel}` : null,
        ...disabilityLabels,
        post.childAge !== null ? `${post.childAge}세 아이` : null,
      ].filter((item): item is string => item !== null);

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
          {formatDate(post.createdAt)}
        </time>
      </header>

      <div className="pb-[20px] pt-[12px]">
        <h1 className="text-h1-onboard text-background-600">{post.title}</h1>
        <p className="mt-[12px] whitespace-pre-wrap text-h3-onboard text-background-600">
          {post.content}
        </p>

        {post.imageUrls.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {post.imageUrls.map((imageUrl, index) => (
              <ImageThumb
                key={`${imageUrl}-${index}`}
                src={imageUrl}
                alt={`${post.title} 첨부 이미지 ${index + 1}`}
                className="aspect-square"
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
                  showMutationError(error, "공감 상태를 변경하지 못했습니다."),
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
                  showMutationError(error, "스크랩 상태를 변경하지 못했습니다."),
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
              <ButtonOutline
                label="수정"
                onClick={() => navigate(`/community/write/${post.postId}`)}
                className="ml-auto !h-[36px] px-[20px] !py-[8px]"
              />

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
                title="게시글을 삭제하시겠어요?"
                description="삭제가 완료되면 고객님의 게시글이 즉시 삭제되며, 이는 복구할 수 없습니다."
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() =>
                  deletePost(post.postId, {
                    onSuccess: () => {
                      showToast("green", "게시물이 삭제되었습니다.");
                      navigate("/community");
                    },
                    onError: (error) =>
                      showMutationError(error, "게시물을 삭제하지 못했습니다."),
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
