import { useNavigate } from "react-router-dom";
import PostListItem from "@/components/PostListItem";
import PostSection from "@/components/PostSection";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import type { RelatedNews } from "@/types/news";

interface RelatedNewsSectionProps {
  title: string;
  items: RelatedNews[];
  isPending: boolean;
  isError: boolean;
  onMoreClick: () => void;
}

export default function RelatedNewsSection({
  title,
  items,
  isPending,
  isError,
  onMoreClick,
}: RelatedNewsSectionProps) {
  const navigate = useNavigate();

  return (
    <PostSection title={title} onMoreClick={onMoreClick}>
      {isPending && (
        <p className="py-[20px] text-center text-h6-list text-background-500">
          관련 소식을 불러오는 중입니다...
        </p>
      )}
      {isError && (
        <p className="py-[20px] text-center text-h6-list text-background-500">
          관련 소식을 불러오지 못했습니다.
        </p>
      )}
      {!isPending && !isError && items.length === 0 && (
        <p className="py-[20px] text-center text-h6-list text-background-500">
          같은 지역에서 모집 중인 소식이 없습니다.
        </p>
      )}
      {items.map((item) => (
        <PostListItem
          key={item.newsId}
          region={item.region}
          title={item.title}
          rightSlot={
            <span className="inline-flex items-center gap-[8px]">
              <ViewStat count={item.viewCount} />
              <ScrapStat count={item.scrapCount} />
            </span>
          }
          onClick={() => navigate(`/news/${item.newsId}`)}
        />
      ))}
    </PostSection>
  );
}
