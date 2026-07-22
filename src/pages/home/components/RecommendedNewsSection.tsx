import { postList } from "@/mocks/post";
import NewsCard from "./NewsCard";
import PostSection from "./PostSection";
import PostListItem from "./PostListItem";
import type { RecommendedNews } from "@/types/home";
import { useHomeNewsPreview } from "@/hooks/useHome";

interface RecommendedNewsSectionProps {
  news: RecommendedNews[];
}

export default function RecommendedNewsSection({
  news,
}: RecommendedNewsSectionProps) {
  const { data: activityNews = [] } = useHomeNewsPreview("ACTIVITY");
  const { data: localNews = [] } = useHomeNewsPreview("LOCAL");

  return (
    <section className="flex flex-col shrink-0 overflow-hidden">
      <div>
        <h2 className="mt-[20px] text-h2-list text-background-600">추천하는 소식 Top 5</h2>
        <p className="mt-[3.6px] mb-[13.6px] text-h6-list text-background-500">
          지역 · 활동별 맞춤 소식을 확인하세요
        </p>
      </div>

      <div className="flex gap-[12px] overflow-x-auto no-scrollbar">
        {news.map((item) => (
          <NewsCard
            key={item.newsId}
            {...item}
          />
        ))}
      </div>

      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection title="활동소식">
          {activityNews.map((news) => (
            <PostListItem
              key={news.newsId}
              title={news.title}
              region={String(news.region)}
              likes={news.likeCount}
              views={news.viewCount}
            />
          ))}
        </PostSection>
        <PostSection title="지역소식">
          {localNews.map((news) => (
            <PostListItem
              key={news.newsId}
              title={news.title}
              region={String(news.region)}
              likes={news.likeCount}
              views={news.viewCount}
            />
          ))}
        </PostSection>
      </div>
    </section>
  );
}