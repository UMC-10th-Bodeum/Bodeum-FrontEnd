import type { ReactNode } from "react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";
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
import { useState } from "react";
import DeleteConfirmModal from "@/pages/community/components/detail/DeleteConfirmModal";
import type { CommunityPostDetail } from "@/types/community";

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
  const { mutate: toggleLike, isPending: isLikePending } = useToggleCommunityPostLike(post.postId);
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleCommunityPostScrap(
    post.postId,
  );
  const navigate = useNavigate();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteCommunityPost(post.postId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <article className="min-h-[574px] rounded-[18px] border border-background-250 bg-background-100 px-[40px] py-[20px]">
      <header className="flex items-center justify-between border-b border-background-250 pb-[20px]">
        <div className="flex min-w-0 items-center gap-[12px] [&>span:first-child]:!h-[20px]">
          <PostTag type="ETC" label={communityCategoryMap[category]} />
          <span className="truncate text-body-sub text-background-500">{post.authorNickname}</span>
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
        <h1 className="text-h1-onboard text-background-600">{post.title}</h1>
        <p className="mt-[12px] whitespace-pre-wrap text-h3-onboard text-background-600">
          {post.content}
        </p>

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

        {(post.disabilityTypes.length > 0 || post.hashtags.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.disabilityTypes.map((type) => (
              <PostTag key={type} type={type} />
            ))}
            {post.hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="rounded-full bg-background-200 px-3 py-1 text-body-label text-background-500"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-background-250 py-[16px]">
        <div className="flex items-center gap-[10px]">
          <DetailBackButton
            icon={post.isLiked ? HeartIcon : HeartDisabledIcon}
            label={`공감 ${post.likeCount}`}
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
            label={`스크랩 ${post.scrapCount}`}
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
          <DetailBackButton icon={ShareIcon} label="공유" onClick={() => {}} />
        </div>

        <div className="flex items-center gap-2">
          {post.isMine && (
            <>
              <DetailBackButton
                icon={null}
                label="삭제"
                tone="danger"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(true)}
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
