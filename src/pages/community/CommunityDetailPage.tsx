import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hasStoredAuthSession } from "@/apis/authApi";
import ButtonOutline from "@/components/ButtonOutline";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import {
  communityCategoryMap,
  communityCategoryCodeMap,
  getCommunityCategoryByCode,
  type CommunityCategory,
} from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCommunityPost, useCommunityPosts } from "@/hooks/useCommunity";
import { formatMonthDay } from "@/utils/time";
import CommunityCommentsSection from "./components/comments/CommunityCommentsSection";
import CommunityPostDetailCard from "./components/detail/CommunityPostDetailCard";
import CommunityRelatedPostCard from "./components/detail/CommunityRelatedPostCard";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = hasStoredAuthSession();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);
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
      <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[80px] text-center text-background-500">
        게시글을 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !post || !category) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[20px]">
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
    <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto flex w-full flex-col gap-[18px]">
        <div
          className={
            showLoginModal ? "pointer-events-none select-none blur-sm" : undefined
          }
          aria-hidden={showLoginModal}
        >
          <CommunityPostDetailCard key={post.postId} post={post} category={category}>
            <CommunityCommentsSection
              key={post.postId}
              postId={post.postId}
              canAdopt={post.isMine && post.boardType === "INFORMATION_QUESTION"}
              onLoginRequired={() => setShowLoginModal(true)}
            />
          </CommunityPostDetailCard>
        </div>

        <CommunityRelatedPostsSection
          key={post.boardType}
          currentPostId={post.postId}
          category={category}
        />
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title="로그인하고 더 많은 기능을 이용해 보세요!"
            description={`회원가입 후 프로필을 등록하시면,\nAI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이\n자유롭게 이용하실 수 있습니다.`}
            leftButtonText="둘러보기"
            rightButtonText="로그인/회원가입"
            className="z-[70]!"
            onLeftButtonClick={() => navigate("/community")}
            onRightButtonClick={() => navigate("/auth")}
          />
        </div>
      )}
    </div>
  );
}

interface CommunityRelatedPostsSectionProps {
  currentPostId: number;
  category: CommunityCategory;
}

function CommunityRelatedPostsSection({
  currentPostId,
  category,
}: CommunityRelatedPostsSectionProps) {
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useCommunityPosts({
    page: 0,
    size: 14,
    sort: "latest",
    categoryCode: communityCategoryCodeMap[category],
  });
  const relatedPosts = Array.from(
    new Map(
      (data?.content ?? [])
        .filter((item) => item.postId !== currentPostId)
        .map((item) => [item.postId, item] as const),
    ).values(),
  ).slice(0, 5);

  return (
    <section className="flex flex-col gap-[14px] rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[20px]">
      <p className="text-h2-list text-background-600">
        {communityCategoryMap[category]} 게시판의 다른 글
      </p>

      {isPending ? (
        <p className="py-6 text-center text-background-500">게시글을 불러오는 중입니다.</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6 text-background-500">
          <p>게시글을 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-background-300 px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : relatedPosts.length === 0 ? (
        <p className="py-6 text-center text-background-500">같은 게시판의 다른 글이 없습니다.</p>
      ) : (
        <div className="space-y-[8px]">
          {relatedPosts.map((item) => (
            <CommunityRelatedPostCard
              key={item.postId}
              title={item.title}
              createdAt={formatMonthDay(item.createdAt)}
              likes={item.likeCount}
              comments={item.commentCount}
              views={item.viewCount}
              onClick={() => navigate(`/community/${item.postId}`)}
            />
          ))}
        </div>
      )}

      <ButtonOutline
        label="더보기"
        onClick={() =>
          navigate(`/community?categoryCode=${communityCategoryCodeMap[category]}`)
        }
        className="h-[40px] w-full"
      />
    </section>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto flex w-[680px] flex-col items-center rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[48px] text-center">
        <h1 className="text-h2-list text-background-600">게시글을 찾을 수 없습니다.</h1>
        <p className="mt-[8px] text-h5 text-background-500">
          삭제되었거나 존재하지 않는 게시글입니다.
        </p>
      </div>
    </div>
  );
}
