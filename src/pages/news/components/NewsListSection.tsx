import { useNavigate } from "react-router-dom";
import type { NewsListItem } from "@/types/news";
import ProgramItem from "@/components/ProgramItem";
import { getNewsStatusPresentation } from "@/utils/newsStatus";

interface NewsListSectionProps {
  items: NewsListItem[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function NewsListSection({ items, isLoading, isError }: NewsListSectionProps) {
  const navigate = useNavigate();

  if (isLoading || isError) {
    return (
      <div className="flex min-h-[240px] items-center justify-center px-[24px] py-[48px] text-center text-body1 text-background-500">
        {isError ? "소식을 불러오지 못했습니다." : "소식을 불러오는 중입니다..."}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
      {items.length === 0 && (
        <div className="col-span-2 flex min-h-[240px] items-center justify-center px-[24px] py-[48px] text-center text-body1 text-background-500">
          조건에 맞는 뉴스가 없습니다.
        </div>
      )}
      {items.map((item) => {
        const status = getNewsStatusPresentation(item.status, item.applyEndDate);

        return (
          <ProgramItem
            key={item.newsId}
            name={item.title}
            address={item.region}
            services={[item.sourceName]}
            categoryLabel={item.categoryLabel}
            chipText={item.status ? status.label : undefined}
            chipVariant={status.variant}
            contact={item.contact}
            viewCount={item.viewCount}
            scrapCount={item.scrapCount}
            onClick={() => navigate(`/news/${item.newsId}`)}
          />
        );
      })}
    </section>
  );
}
