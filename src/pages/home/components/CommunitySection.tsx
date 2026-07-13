import type { DiagnosisType } from "@/types/diagnosis";
import CommunityCard from "./CommunityCard";
import MainButton from "@/components/MainButton";
import PostSection from "./PostSection";
import { postList } from "@/mocks/post";
import PostListItem from "./PostListItem";

export interface CommunityPost {
  id: number;
  diagnosis: DiagnosisType;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
}

interface CommunitySectionProps {
  posts: CommunityPost[];
  onWrite?: () => void;
  onMore?: () => void;
}

export default function CommunitySection({
  posts,
  onWrite,
  onMore,
}: CommunitySectionProps) {
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
          <MainButton size="S" onClick={onWrite}>글쓰기</MainButton>
          <MainButton size="S" stroke onClick={onMore}>전체보기</MainButton>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
        <div className="inline-flex gap-4">
          {posts.map((post) => (
            <CommunityCard key={post.id} {...post} />
          ))}
        </div>
      </div>
      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection title="인기글">
          {postList.map((post) => (
            <PostListItem key={post.id} {...post} />
          ))}
        </PostSection>
        <PostSection title="최신글">
          {postList.map((post) => (
            <PostListItem key={post.id} {...post} />
          ))}
        </PostSection>
      </div>
    </section>
  );
}