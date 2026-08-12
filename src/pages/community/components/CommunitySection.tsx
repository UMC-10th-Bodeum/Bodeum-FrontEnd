import ButtonFill from "@/components/ButtonFill";
import CommunityCard from "@/components/CommunityCard";
import { useRecommendedCommunityPosts } from "@/hooks/useHome";

interface CommunitySectionProps {
  onWriteClick: () => void;
  onPostClick: (postId: number) => void;
}

export default function CommunitySection({ onWriteClick, onPostClick }: CommunitySectionProps) {
  const { data: posts = [] } = useRecommendedCommunityPosts();

  return (
    <section className="w-full min-w-0 overflow-hidden">
      <div className="mb-[12px] flex items-center justify-between">
        <div>
          <h2 className="text-h2-list">커뮤니티 이야기</h2>
          <p className="mt-[3.6px] text-h6-list text-gray-500">
            다른 부모들이 작성한 글을 확인하세요
          </p>
        </div>

        <ButtonFill
          label="글쓰기"
          onClick={onWriteClick}
          className="!h-[38px] !w-[84px] !px-[16px] !py-[10px]"
        />
      </div>

      <div className="no-scrollbar w-full min-w-0 overflow-x-auto">
        <div className="inline-flex gap-4">
          {posts.map((post) => (
            <CommunityCard
              key={post.postId}
              {...post}
              onClick={() => onPostClick(post.postId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
