import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ButtonOutline from "@/components/ButtonOutline";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { communityPosts } from "@/mocks/community";
import type { CommunityPost } from "@/types/community";
import { communityCategoryMap, type CommunityCategory } from "@/constants/communityCategory";
import CommunityCommentsSection from "./components/comments/CommunityCommentsSection";
import CommunityRelatedPostCard from "./components/detail/CommunityRelatedPostCard";
import CommunityPostDetailCard from "./components/detail/CommunityPostDetailCard";

type DetailPost = CommunityPost & {
  board?: string;
};

const detailBody =
  "처음 진단을 받았을 때는 정말 앞이 막막했어요. 아이가 눈을 잘 맞추지 못하고 이름을 불러도 반응이 없을 때, 세상이 무너지는 기분이었습니다. 어디서부터 시작해야 할지, 무슨 치료를 받아야 할지 아무것도 몰랐어요. 그때 이 커뮤니티에서 봄날의 엄마님을 만나고, ABA 치료사를 소개받아서 6개월째 꾸준히 치료를 받고 있습니다. 오늘 드디어... 아이가 제 눈을 바라보며 웃었어요. 😭 말로 설명하기 어려운 감동이었습니다. 아직 갈 길이 멀지만, 이렇게 작은 변화 하나가 얼마나 큰 힘이 되는지 새삼 느꼈어요. ABA 치료 시작하시려는 분들께 말씀드리고 싶어요. 처음에는 아이가 힘들어하고 부모도 지치지만, 꾸준함이 정말 중요한 것 같아요. 여러분의 아이도 분명 조금씩 변화할 거예요. 우리 모두 화이팅입니다 💙";

const defaultPost: DetailPost = {
  id: 1,
  category: "GROWTH_RECORD",
  diagnosis: "AUTISM",
  author: "NN님 · Level1 · 자폐스펙트럼 · N세 아이",
  createdAt: "2시간 전",
  title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요 😭",
  content: detailBody,
  likes: 142,
  comments: 38,
  views: 1204,
  imageCount: 3,
};

const relatedPosts = Array.from({ length: 5 }, (_, index) => ({
  id: index + 2,
  createdAt: "00.00",
  title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요 😭",
  likes: 142,
  comments: 38,
  views: 1204,
}));

export default function CommunityDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const routeState = location.state as {
    post?: DetailPost;
    category?: CommunityCategory;
  } | null;

  const post = useMemo<DetailPost | undefined>(() => {
    const postId = id && /^[1-9]\d*$/.test(id) ? Number(id) : undefined;
    const matched =
      postId !== undefined && Number.isSafeInteger(postId)
        ? communityPosts.find((item) => item.id === postId)
        : undefined;

    if (!matched) {
      return undefined;
    }

    const statePost =
      routeState?.post?.id === matched.id ? routeState.post : undefined;

    return {
      ...defaultPost,
      ...matched,
      ...statePost,
      content: detailBody,
    };
  }, [id, routeState]);

  const selectedCategory = post
    ? routeState?.category ?? post.category
    : undefined;
  const categoryLabel = selectedCategory
    ? communityCategoryMap[selectedCategory]
    : "게시글을 찾을 수 없습니다";

  useEffect(() => {
    setBreadcrumb([{ label: "커뮤니티" }, { label: categoryLabel }]);

    return () => setBreadcrumb([]);
  }, [categoryLabel, setBreadcrumb]);

  if (!post) {
    return (
      <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
        <div className="mx-auto flex w-[680px] flex-col items-center rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[48px] text-center">
          <h1 className="text-h2-list text-background-600">
            게시글을 찾을 수 없습니다
          </h1>
          <p className="mt-[8px] text-h5 text-background-500">
            삭제되었거나 존재하지 않는 게시글입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto flex w-[1176px] flex-col gap-[18px]">
        <CommunityPostDetailCard post={post}>
          <CommunityCommentsSection
            key={post.id}
            storageKey={`community-comments-${post.id}`}
            totalCount={post.comments}
          />
        </CommunityPostDetailCard>

        <section className="flex flex-col gap-[14px] rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[20px]">
          <p className="text-h2-list text-background-600">{categoryLabel} 게시판의 다른 글</p>
          <div className="space-y-[8px]">
            {relatedPosts.map((item) => (
              <CommunityRelatedPostCard
                key={item.id}
                {...item}
                onClick={() =>
                  navigate(`/community/${item.id}`, {
                    state: { category: selectedCategory },
                  })
                }
              />
            ))}
          </div>
          <ButtonOutline
            label="더보기"
            onClick={() => navigate("/community")}
            className="w-full h-[40px]"
          />
        </section>
      </div>
    </div>
  );
}
