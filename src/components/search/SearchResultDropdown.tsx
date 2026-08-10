import { infoCategoryMap } from "@/constants/infoCategory";
import type { InfoSearchResult } from "@/types/search";
import SearchResultItem from "./SearchResultItem";
import EmptySearchResult from "./EmptySearchResult";

interface SearchResultDropdownProps {
  grouped: Record<string, InfoSearchResult[]>;
  flatResults: InfoSearchResult[];
  keyword: string;
  activeIndex: number | null;
  isKeyboardNavigation: boolean;
  onSelect: (item: InfoSearchResult) => void;
  onMouseMove: () => void;
  resultRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export default function SearchResultDropdown({
  grouped,
  flatResults,
  keyword,
  activeIndex,
  isKeyboardNavigation,
  onSelect,
  onMouseMove,
  resultRefs,
}: SearchResultDropdownProps) {
  const getItemIndex = (itemId: string | number) => {
    return flatResults.findIndex((r) => r.infoItemId === itemId);
  };

  if (flatResults.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-[48px] z-50 max-h-[400px] overflow-y-auto rounded-[10px] border border-background-200 bg-white px-1 py-2 shadow-[1px_2px_15px_0px_#00000026]">
        <EmptySearchResult />
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-[48px] z-50 max-h-[400px] overflow-y-auto rounded-[10px] border border-background-200 bg-white px-1 py-2 shadow-[1px_2px_15px_0px_#00000026]">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="p-2 text-h3-category-sub text-background-400">
            {infoCategoryMap[category as keyof typeof infoCategoryMap]?.label}
          </div>

          {items.map((item) => {
            const itemIndex = getItemIndex(item.infoItemId);
            const isActive = activeIndex === itemIndex;

            return (
              <SearchResultItem
                key={item.infoItemId}
                item={item}
                keyword={keyword}
                isActive={isActive}
                isKeyboardNavigation={isKeyboardNavigation}
                onSelect={onSelect}
                onMouseMove={onMouseMove}
                setRef={(el) => {
                  if (itemIndex !== -1) {
                    resultRefs.current[itemIndex] = el;
                  }
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}