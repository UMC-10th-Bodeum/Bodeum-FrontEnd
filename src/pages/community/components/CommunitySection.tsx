import ButtonFill from "@/components/ButtonFill";
import CommunityCard from "@/components/CommunityCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useRecommendedCommunityPosts } from "@/hooks/useHome";

interface CommunitySectionProps {
  onWriteClick: () => void;
  onPostClick: (postId: number) => void;
}

export default function CommunitySection({ onWriteClick, onPostClick }: CommunitySectionProps) {
  const { data: posts = [], isPending, isError } = useRecommendedCommunityPosts();
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClickCapture,
  } = useDragScroll();

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

      {isPending ? (
        <p className="py-6 text-center text-background-500">게시글을 불러오는 중입니다.</p>
      ) : isError ? (
        <p className="py-6 text-center text-background-500">게시글을 불러오지 못했습니다.</p>
      ) : posts.length === 0 ? (
        <p className="py-6 text-center text-background-500">추천 게시글이 없습니다.</p>
      ) : (
        <div
          className="no-scrollbar w-full min-w-0 overflow-x-auto"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClickCapture={handleClickCapture}
        >
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
      )}
    </section>
  );
}
