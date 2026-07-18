import InfoItem from "@/components/InfoItem";
import type { ChipVariant } from "@/components/Chips";
import type { InfoItemCategory } from "@/components/InfoItem";

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
}

export default function NewsListSection({ items }: NewsListSectionProps) {
  return (
    <section className="grid grid-cols-2 gap-x-[24px] gap-y-[14px]">
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
          onClick={() => {}}
        />
      ))}
    </section>
  );
}
