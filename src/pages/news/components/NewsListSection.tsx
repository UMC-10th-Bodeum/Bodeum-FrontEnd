import { useNavigate } from "react-router-dom";
import type { NewsSourceTab } from "@/constants/newsSourceTab";
import type { NewsListItem } from "../data/newsMockData";
import ProgramItem from "@/components/ProgramItem";

interface NewsListSectionProps {
  items: NewsListItem[];
  sourceTab: NewsSourceTab;
}

export default function NewsListSection({ items, sourceTab }: NewsListSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-2 gap-x-[24px] gap-y-[14px]">
      {items.length === 0 && (
        <div className="col-span-2 flex min-h-[240px] items-center justify-center rounded-[10px] border border-background-300 bg-white px-[24px] py-[48px] text-center text-body1 text-background-500">
          조건에 맞는 뉴스가 없습니다.
        </div>
      )}
      {items.map((item) => (
        <ProgramItem
          key={item.id}
          name={item.name}
          address={item.address}
          services={item.services}
          chipText={item.chipText}
          chipVariant={item.chipVariant}
          viewCount={item.viewCount}
          scrapCount={item.scrapCount}
          isScrapped={item.isScrapped}
          onClick={() => navigate(`/news/${sourceTab}/${item.id}`, { state: { item } })}
        />
      ))}
    </section>
  );
}