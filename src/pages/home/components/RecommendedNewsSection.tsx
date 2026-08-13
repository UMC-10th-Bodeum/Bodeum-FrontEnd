import NewsCard from "./NewsCard";
import PostSection from "@/components/PostSection";
import PostListItem from "@/components/PostListItem";
import { useHomeNewsPreview, useRecommendedNews } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";
import AsyncState from "@/components/AsyncState";

export default function RecommendedNewsSection() {
  const navigate = useNavigate();
  const { data: activityNews = [] } = useHomeNewsPreview("ACTIVITY");
  const { data: localNews = [] } = useHomeNewsPreview("LOCAL");
  const {
    data: news = [],
    isPending,
    isError,
  } = useRecommendedNews();

  return (
    <section className="flex flex-col shrink-0 overflow-hidden">
      <div>
        <h2 className="mt-[20px] text-h2-list text-background-600">추천하는 소식 Top 5</h2>
        <p className="mt-[3.6px] mb-[13.6px] text-h6-list text-background-500">
          지역 · 활동별 맞춤 소식을 확인하세요
        </p>
      </div>

      {isPending ? (
        <AsyncState
          type="loading"
          variant="section"
          loadingText="불러오는 중입니다..."
          className="flex h-[180px] items-center justify-center text-background-500"
          textClassName=""
        />
      ) : isError ? (
        <AsyncState
          type="error"
          variant="section"
          errorText="추천 소식을 불러오지 못했습니다."
          className="flex h-[180px] items-center justify-center text-background-500"
          textClassName=""
        />
      ) : (
        <div className="flex gap-[12px] overflow-x-auto no-scrollbar">
          {news.map((item) => (
            <NewsCard key={item.newsId} {...item} />
          ))}
        </div>
      )}

      <div className="flex flex-row mt-[20.5px] gap-[24px]">
        <PostSection
          title="활동소식"
          onMoreClick={() => navigate("/news?newsType=ACTIVITY")}
        >
          {activityNews.map((news) => (
            <PostListItem
              key={news.newsId}
              title={news.title}
              region={`${news.regionLevel1} ${news.regionLevel2}`}
              likes={news.likeCount}
              views={news.viewCount}
              onClick={() => navigate(`/news/${news.newsId}`)}
            />
          ))}
        </PostSection>
        <PostSection
          title="지역소식"
          onMoreClick={() => navigate("/news?newsType=LOCAL")}
        >
          {localNews.map((news) => (
            <PostListItem
              key={news.newsId}
              title={news.title}
              region={`${news.regionLevel1} ${news.regionLevel2}`}
              likes={news.likeCount}
              views={news.viewCount}
              onClick={() => navigate(`/news/${news.newsId}`)}
            />
          ))}
        </PostSection>
      </div>
    </section>
  );
}
