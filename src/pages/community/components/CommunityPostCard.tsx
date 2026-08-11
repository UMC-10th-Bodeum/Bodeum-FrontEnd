import { getApiErrorMessage } from "@/apis/apiError";
import PostTag from "@/components/PostTag";
import { showToast } from "@/components/Toast";
import CommentStat from "@/components/post-stat/CommentStat";
import HeartStat from "@/components/post-stat/HeartStat";
import ViewStat from "@/components/post-stat/ViewStat";
import { useToggleCommunityPostLike } from "@/hooks/useCommunity";

interface CommunityPostCardProps {
  id: number;
  categoryLabel: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  imageCount: number;
  createdAt: string;
  initialIsLiked?: boolean;
  onClick?: () => void;
}

export default function CommunityPostCard({
  id,
  categoryLabel,
  title,
  content,
  likes,
  comments,
  views,
  createdAt,
  initialIsLiked = false,
  onClick,
}: CommunityPostCardProps) {
  const { mutate: toggleLike, isPending: isLikePending } = useToggleCommunityPostLike(id);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        onClick?.();
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className="flex h-[102px] w-full min-w-0 cursor-pointer flex-col rounded-[10px] border border-background-250 bg-background-100 p-[16px] hover:shadow-[1px_2px_15px_0px_#00000026] active:border-main-400"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <PostTag type="ETC" label={categoryLabel} />
          <div className="flex gap-[14px]">
            <HeartStat
              count={likes}
              isActive={initialIsLiked}
              disabled={isLikePending}
              onClick={() =>
                toggleLike(initialIsLiked, {
                  onError: (error) =>
                    showToast("red", getApiErrorMessage(error, "공감 상태를 변경하지 못했습니다.")),
                })
              }
            />
            <CommentStat count={comments} />
            <ViewStat count={views} />
          </div>
        </div>
        <span className="shrink-0 text-body-sub text-background-400">{createdAt}</span>
      </div>

      <p className="mt-[8px] line-clamp-1 text-h5-list text-background-600">{title}</p>
      <p className="mt-[4px] line-clamp-1 text-h6-list text-background-500">{content}</p>
    </article>
  );
}
