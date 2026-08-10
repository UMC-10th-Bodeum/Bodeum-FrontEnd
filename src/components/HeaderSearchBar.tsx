import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import { searchCategoryIconMap, infoCategoryMap } from "@/constants/infoCategory";
import CancelIcon from "@/assets/icons/Cancel-rounded.svg?react";
import type { InfoSearchResult } from "@/types/search";

interface HeaderSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  results: InfoSearchResult[];
  onSelect: (item: InfoSearchResult) => void;
  placeholder?: string;
  className?: string;
}

export default function HeaderSearchBar({
  value,
  onChange,
  results,
  onSelect,
  placeholder = "기관·병원·복지·취업·교육 정보를 검색해보세요",
  className = "",
}: HeaderSearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const grouped = results.reduce<Record<string, InfoSearchResult[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (!focused || value.trim() === "" || results.length === 0) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      setActiveIndex((prev) => {
        if (prev === null) {
          return 0;
        }

        return prev === flatResults.length - 1 ? 0 : prev + 1;
      });

      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      setActiveIndex((prev) => {
        if (prev === null) {
          return flatResults.length - 1;
        }

        return prev === 0 ? flatResults.length - 1 : prev - 1;
      });

      return;
    }
    
    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex !== null) {
        const selectedItem = flatResults[activeIndex];

        if (selectedItem) {
          onSelect(selectedItem);
          setFocused(false);
          setActiveIndex(null);
        }
      }

      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setFocused(false);
      setActiveIndex(null);
    }
  };


  useEffect(() => {
    setActiveIndex(null);
    setIsKeyboardNavigation(false);
    resultRefs.current = [];
  }, [value]);

  useEffect(() => {
  if (activeIndex === null) return;

  resultRefs.current[activeIndex]?.scrollIntoView({
    block: "nearest",
  });
  }, [activeIndex]);
  
  let globalIndex = 0;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        className={`
          flex h-[40px] items-center rounded-[10px]
          border px-[20px]
          transition-colors
          ${focused
            ? "border-main-400 bg-background-100"
            : "border-background-200 bg-background-200"
          }
        `}
      >
        <SearchIcon className="mr-[15px] h-[18px] w-[18px] shrink-0 text-background-500" />

        <input
          aria-label="정보 검색"
          value={value}
          onFocus={() => setFocused(true)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="
            w-full bg-transparent
            text-h3-category-sub
            text-background-700
            placeholder:text-background-500
            outline-none
          "
        />
        {value.trim() !== "" && (
          <button
            aria-label="검색어 지우기"
            type="button"
            onClick={() => onChange("")}
            className="ml-2 shrink-0"
          >
            <CancelIcon aria-hidden="true" />
          </button>
        )}
      </div>

      {focused && value.trim() !== "" && (
        <div
          className="
            absolute left-0 right-0 top-[48px]
            z-50 max-h-[400px]
            overflow-y-auto
            rounded-[10px]
            border border-background-200
            bg-white
            px-1 py-2
            shadow-[1px_2px_15px_0px_#00000026]
          "
        >
          {results.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-[25.5px]"
            >
              <SearchIcon className="mb-3 h-[50px] w-[50px] text-background-300" />

              <p className="text-h3-category-sub text-background-700">
                검색결과가 없어요
              </p>

              <p className="text-h6 text-background-400">
                검색어를 변경해보세요
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="p-2 text-h3-category-sub text-background-400">
                  {
                    infoCategoryMap[
                      category as keyof typeof infoCategoryMap
                    ]?.label
                  }
                </div>

                {items.map((item) => {
                  const currentIndex = globalIndex++;
                  const Icon =
                    searchCategoryIconMap[item.category as keyof typeof searchCategoryIconMap];
                  
                  const isActive = activeIndex === currentIndex;

                  return (
                    <button
                      key={item.infoItemId}
                      type="button"
                      ref={(el) => {
                        resultRefs.current[currentIndex] = el;
                      }}
                      
                      onClick={() => {
                        onSelect(item);
                        setFocused(false);
                        setActiveIndex(-1);
                      }}
                      className={`
                        flex w-full items-center
                        p-3 rounded-[10px]
                        text-left
                        outline-none
                        border-none
                        focus:outline-none
                        focus:ring-0
                        focus:border-none
                        ${isActive
                          ? "bg-background-200"
                          : !isKeyboardNavigation
                            ? "hover:bg-background-200"
                            : ""
                        }
                         active:bg-background-200
                      `}
                    >
                      <Icon className="mr-2 h-6 w-6 shrink-0" />

                      <div className="flex flex-col">
                        <span className="text-h3-category-sub text-background-500">
                          {highlightText(item.name, value)}
                        </span>

                        <span className="text-h3-onboard text-background-400">
                          {[item.regionLevel1, item.regionLevel2].filter(Boolean).join(" ")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}