import InfoItem from "@/components/InfoItem";
import type { ChipVariant } from "@/components/Chips";
import type { InfoItemCategory } from "@/components/InfoItem";
import { useNavigate } from "react-router-dom";

export interface NewsListItem {
  id: number;
  type: InfoItemCategory;
  name: string;
  address: string;
  services: string[];
  chipText?: string;
  chipVariant?: ChipVariant;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
}

interface NewsListSectionProps {
  items: NewsListItem[];
  sourceTab: "activity" | "region";
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
        <InfoItem
          key={item.id}
          type={item.type}
          name={item.name}
          address={item.address}
          services={item.services}
          chipText={item.chipText}
          chipVariant={item.chipVariant}
          viewCount={item.viewCount}
          scrapCount={item.scrapCount}
          isScrapped={item.isScrapped}
          onClick={() => navigate(`/news/${item.id}`, { state: { item, sourceTab } })}
        />
      ))}
    </section>
  );
}
