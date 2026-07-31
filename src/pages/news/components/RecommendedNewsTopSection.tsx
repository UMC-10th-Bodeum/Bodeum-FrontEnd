import NewsCard from "@/pages/home/components/NewsCard";
import { useNavigate } from "react-router-dom";
import type { NewsListItem } from "../data/newsMockData";

interface RecommendedNewsTopSectionProps {
  items: NewsListItem[];
}

export default function RecommendedNewsTopSection({ items }: RecommendedNewsTopSectionProps) {
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
        {items.map((item) => {
          const [region, ...districtParts] = item.address.split(" ");

          return (
            <NewsCard
              key={item.id}
              title={item.name}
              region={region}
              category={districtParts.join(" ")}
              dDay={item.daysRemaining}
              views={item.viewCount}
              thumbnail={item.thumbnail}
              onClick={() => navigate(`/news/${item.id}`, { state: { item } })}
            />
          );
        })}
      </div>
    </section>
  );
}
