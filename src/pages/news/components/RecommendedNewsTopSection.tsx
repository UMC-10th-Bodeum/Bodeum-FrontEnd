import NewsCard from "@/pages/home/components/NewsCard";
import { useNavigate } from "react-router-dom";

interface News {
  id: number;
  title: string;
  region: string;
  category: string;
  dDay: number;
  views: number;
  thumbnail?: string;
}

interface RecommendedNewsTopSectionProps {
  news: News[];
}

export default function RecommendedNewsTopSection({ news }: RecommendedNewsTopSectionProps) {
  const navigate = useNavigate();

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
          <NewsCard
            key={item.id}
            {...item}
            onClick={() => navigate(`/news/${item.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
