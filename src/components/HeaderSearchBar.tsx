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
  const wrapperRef = useRef<HTMLDivElement>(null);
  

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

    const parts = text.split(new RegExp(`(${keyword})`, "gi"));

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

  const grouped = results.reduce<Record<string, InfoSearchResult[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

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
          value={value}
          onFocus={() => setFocused(true)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
            type="button"
            onClick={() => onChange("")}
            className="ml-2 shrink-0"
          >
            <CancelIcon />
          </button>
        )}
      </div>

      {focused && value.trim() !== "" && (
        <div
          className="
            absolute left-0 right-0 top-[48px]
            rounded-[10px]
            border border-background-200
            bg-white
            shadow-[1px_2px_15px_0px_#00000026]
            overflow-hidden
            z-50
            px-1 py-2
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
                  const Icon =
                    searchCategoryIconMap[item.category as keyof typeof searchCategoryIconMap];

                  return (
                    <button
                      key={item.infoItemId}
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        setFocused(false);
                      }}
                      className="
                        flex w-full items-center
                        p-3 rounded-[10px]
                        text-left
                        hover:bg-background-200
                        active:bg-background-200
                        active:border active:border-background-300
                      "
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