import CommunityCard from "./CommunityCard";
import MainButton from "@/components/MainButton";
import PostSection from "./PostSection";
import PostListItem from "./PostListItem";
import { useNavigate } from "react-router-dom";
import { useHomePostPreview, useRecommendedCommunityPosts } from "@/hooks/useHome";

export default function CommunitySection() {
  const navigate = useNavigate();
  const { data: posts = [] } = useRecommendedCommunityPosts();
  const { data: popularPosts = [] } = useHomePostPreview("popular");
  const { data: latestPosts = [] } = useHomePostPreview("latest");

  return (
    <section className="w-full min-w-0 overflow-hidden">
      <div className="mt-[20px] mb-[12px] flex items-center justify-between">
        <div>
          <h2 className="text-h2-list">커뮤니티 이야기</h2>
          <p className="mt-[3.6px] text-h6-list text-gray-500">
            다른 부모들이 작성한 글을 확인하세요
          </p>
        </div>

        <div className="flex gap-[10px]">
          <MainButton
            size="S"
            onClick={() => navigate("/community/write")}
          >
            글쓰기
          </MainButton>
          <MainButton
            size="S"
            stroke
            onClick={() => navigate("/community")}
          >
            전체보기
          </MainButton>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
        <div className="inline-flex gap-4">
          {posts.map((post) => (
            <CommunityCard key={post.postId} {...post} />
          ))}
        </div>
      </div>
      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection title="인기글">
          {popularPosts.map((post) => (
            <PostListItem
              key={post.postId}
              title={post.title}
              region={post.categoryName}
              likes={post.likeCount}
              talks={post.commentCount}
              views={post.viewCount}
            />
          ))}
        </PostSection>
        <PostSection title="최신글">
          {latestPosts.map((post) => (
            <PostListItem
              key={post.postId}
              title={post.title}
              region={post.categoryName}
              likes={post.likeCount}
              talks={post.commentCount}
              views={post.viewCount}
            />
          ))}
        </PostSection>
      </div>
    </section>
  );
}