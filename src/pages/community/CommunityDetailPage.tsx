import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonOutline from "@/components/ButtonOutline";
import {
  communityCategoryMap,
  communityCategoryCodeMap,
  getCommunityCategoryByCode,
} from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCommunityPost } from "@/hooks/useCommunity";
import CommunityCommentsSection from "./components/comments/CommunityCommentsSection";
import CommunityPostDetailCard from "./components/detail/CommunityPostDetailCard";
import CommunityRelatedPostCard from "./components/detail/CommunityRelatedPostCard";

const relatedPosts = Array.from({ length: 5 }, (_, index) => ({
  id: index + 2,
  createdAt: "00.00",
  title: "함께 나누고 싶은 커뮤니티 이야기",
  likes: 142,
  comments: 38,
  views: 1204,
}));

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const parsedPostId = id && /^\d+$/.test(id) ? Number(id) : undefined;
  const postId =
    parsedPostId !== undefined && Number.isSafeInteger(parsedPostId) && parsedPostId > 0
      ? parsedPostId
      : undefined;
  const { data: post, isPending, isError, refetch } = useCommunityPost(postId);
  const category = post ? getCommunityCategoryByCode(post.boardType) : undefined;
  const categoryLabel = category ? communityCategoryMap[category] : "커뮤니티";

  useEffect(() => {
    setBreadcrumb([{ label: "커뮤니티" }, { label: categoryLabel }]);

    return () => setBreadcrumb([]);
  }, [categoryLabel, setBreadcrumb]);

  if (postId === undefined) {
    return <NotFoundState />;
  }

  if (isPending) {
    return (
      <div className="min-h-full bg-background-200 px-[32px] py-[80px] text-center text-background-500">
        게시글을 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !post || !category) {
    return (
      <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
        <div className="mx-auto flex w-[680px] flex-col items-center gap-3 rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[48px] text-center">
          <h1 className="text-h2-list text-background-600">게시글을 불러오지 못했습니다.</h1>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-background-300 px-4 py-2 text-background-500"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto flex w-[1176px] flex-col gap-[18px]">
        <CommunityPostDetailCard key={post.postId} post={post} category={category}>
          <CommunityCommentsSection
            key={post.postId}
            postId={post.postId}
            isPostAuthor={post.isMine}
          />
        </CommunityPostDetailCard>

        <section className="flex flex-col gap-[14px] rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[20px]">
          <p className="text-h2-list text-background-600">{categoryLabel} 게시판의 다른 글</p>
          <div className="space-y-[8px]">
            {relatedPosts.map((item) => (
              <CommunityRelatedPostCard
                key={item.id}
                {...item}
                onClick={() => navigate(`/community/${item.id}`)}
              />
            ))}
          </div>
          <ButtonOutline
            label="더보기"
            onClick={() =>
              navigate(`/community?categoryCode=${communityCategoryCodeMap[category]}`)
            }
            className="h-[40px] w-full"
          />
        </section>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto flex w-[680px] flex-col items-center rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[48px] text-center">
        <h1 className="text-h2-list text-background-600">게시글을 찾을 수 없습니다.</h1>
        <p className="mt-[8px] text-h5 text-background-500">
          삭제되었거나 존재하지 않는 게시글입니다.
        </p>
      </div>
    </div>
  );
}
