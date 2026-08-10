import { searchCategoryIconMap } from "@/constants/infoCategory";
import type { InfoSearchResult } from "@/types/search";

interface SearchResultItemProps {
  item: InfoSearchResult;
  keyword: string;
  isActive: boolean;
  isKeyboardNavigation: boolean;
  onSelect: (item: InfoSearchResult) => void;
  onMouseMove: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedKeyword})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} className="text-background-600">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function SearchResultItem({
  item,
  keyword,
  isActive,
  isKeyboardNavigation,
  onSelect,
  onMouseMove,
  setRef,
}: SearchResultItemProps) {
  const Icon = searchCategoryIconMap[item.category as keyof typeof searchCategoryIconMap];

  return (
    <button
      type="button"
      ref={setRef}
      onMouseMove={onMouseMove}
      onClick={() => onSelect(item)}
      className={`
        flex w-full items-center
        p-3 rounded-[10px]
        text-left
        outline-none
        border-none
        focus:outline-none
        focus:ring-0
        focus:border-none
        ${
          isActive
            ? "bg-background-200"
            : !isKeyboardNavigation
              ? "hover:bg-background-200"
              : ""
        }
        active:bg-background-200
      `}
    >
      {Icon && <Icon className="mr-2 h-6 w-6 shrink-0" />}

      <div className="flex flex-col">
        <span className="text-h3-category-sub text-background-500">
          {highlightText(item.name, keyword)}
        </span>

        <span className="text-h3-onboard text-background-400">
          {[item.regionLevel1, item.regionLevel2].filter(Boolean).join(" ")}
        </span>
      </div>
    </button>
  );
}