import { useRecommendedNews } from "@/hooks/useHome";
import NewsCard from "@/pages/home/components/NewsCard";

export default function RecommendedNewsTopSection() {
  const { data: news = [], isPending, isError } = useRecommendedNews();

  if (isPending) {
    return (
      <div className="flex h-[220px] items-center justify-center text-h6 text-background-500">
        추천 소식을 불러오는 중입니다...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[220px] items-center justify-center text-h6 text-background-500">
        추천 소식을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <section className="flex flex-col shrink-0 overflow-hidden">
      <div>
        <h2 className="text-h2-list text-background-600">추천하는 소식 Top 5</h2>
        <p className="mt-[3.6px] mb-[13.6px] text-h6-list text-background-500">
          지역 · 활동별 맞춤 소식을 확인하세요
        </p>
      </div>

      <div className="flex gap-[12px] overflow-x-auto no-scrollbar">
        {news.map((item) => (
          <NewsCard key={item.newsId} {...item} />
        ))}
      </div>
    </section>
  );
}
