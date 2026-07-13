import { postList } from "@/mocks/post";
import NewsCard from "./NewsCard";
import PostSection from "./PostSection";
import PostListItem from "./PostListItem";

interface News {
  id: number;
  title: string;
  region: string;
  category: string;
  dDay: number;
  views: number;
  thumbnail?: string;
}

interface RecommendedNewsSectionProps {
  news: News[];
}

export default function RecommendedNewsSection({
  news,
}: RecommendedNewsSectionProps) {
  return (
    <section className="flex flex-col shrink-0 overflow-hidden">
      <div>
        <h2 className="mt-[20px] text-h2-list text-background-600">추천하는 소식 Top 5</h2>
        <p className="mt-[3.6px] mb-[13.6px] text-h6-list text-background-500">
          지역 · 활동별 맞춤 소식을 확인하세요
        </p>
      </div>

      <div className="flex gap-[12px] overflow-x-auto">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            {...item}
          />
        ))}
      </div>

      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection title="활동소식">
          {postList.map((post) => (
            <PostListItem key={post.id} {...post} />
          ))}
        </PostSection>
        <PostSection title="지역소식">
          {postList.map((post) => (
            <PostListItem key={post.id} {...post} />
          ))}
        </PostSection>
      </div>
    </section>
  );
}