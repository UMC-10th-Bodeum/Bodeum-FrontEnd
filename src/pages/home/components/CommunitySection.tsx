import MainButton from "@/components/button/MainButton";
import PostSection from "@/components/PostSection";
import PostListItem from "@/components/PostListItem";
import { useNavigate } from "react-router-dom";
import { useHomePostPreview } from "@/hooks/useHome";
import { useState } from "react";
import { hasStoredAuthSession } from "@/apis/authStorage";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import RecommendedCommunitySection from "@/components/RecommendedCommunitySection";

export default function CommunitySection() {
  const navigate = useNavigate();
  const { data: popularPosts = [] } = useHomePostPreview("popular");
  const { data: latestPosts = [] } = useHomePostPreview("latest");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleWriteClick = () => {
    if (!hasStoredAuthSession()) {
      setIsLoginModalOpen(true);
      return;
    }

    navigate("/community/write");
  };

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
          <MainButton size="S" onClick={handleWriteClick}>
            글쓰기
          </MainButton>
          <MainButton size="S" stroke onClick={() => navigate("/community")}>
            전체보기
          </MainButton>
        </div>
      </div>

      <RecommendedCommunitySection
        onPostClick={(postId) => navigate(`/community/${postId}`)}
      />
      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection
          title="인기글"
          onMoreClick={() => navigate("/community?sort=view")}
        >
          {popularPosts.map((post) => (
            <PostListItem
              key={post.postId}
              title={post.title}
              region={post.categoryName}
              likes={post.likeCount}
              talks={post.commentCount}
              views={post.viewCount}
              onClick={() => navigate(`/community/${post.postId}`)}
            />
          ))}
        </PostSection>
        <PostSection
          title="최신글"
          onMoreClick={() => navigate("/community?sort=latest")}
        >
          {latestPosts.map((post) => (
            <PostListItem
              key={post.postId}
              title={post.title}
              region={post.categoryName}
              likes={post.likeCount}
              talks={post.commentCount}
              views={post.viewCount}
              onClick={() => navigate(`/communuty/${post.postId}`)}
            />
          ))}
        </PostSection>
      </div>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <OnboardCancelBox
            title="로그인하고 더 많은 기능을 이용해 보세요!"
            description={`회원가입 후 프로필을 등록하시면,
              AI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이
              자유롭게 이용하실 수 있습니다.`}
            leftButtonText="둘러보기"
            rightButtonText="로그인/회원가입"
            onLeftButtonClick={() => setIsLoginModalOpen(false)}
            onRightButtonClick={() => navigate("/auth")}
          />
        </div>
      )}
    </section>
  );
}
