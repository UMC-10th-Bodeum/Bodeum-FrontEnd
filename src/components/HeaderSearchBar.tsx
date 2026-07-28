import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";

export interface SearchResult {
  id: number;
  title: string;
  category: string;
}

interface HeaderSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  results: SearchResult[];
  onSelect: (item: SearchResult) => void;
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

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
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
          ${
            focused
              ? "border-main-400 bg-background-100"
              : "border-background-200 bg-background-200"
          }
        `}
      >
        <SearchIcon className="mr-[15px] h-[18px] w-[18px] shrink-0" />

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
      </div>

      {focused && value.trim() !== "" && (
        <div
          className="
            absolute left-0 right-0 top-[48px]
            rounded-[10px]
            border border-background-200
            bg-white
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          {results.length === 0 ? (
            <div className="py-10 text-center text-body2 text-background-400 items-center justify-center ">
              <SearchIcon className="h-[50px] w-[50px] text-background-300"/>
              <span>검색결과가 없어요</span>
              <span>검색어를 변경해보세요</span>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-5 pt-4 pb-2 text-caption text-background-400">
                  {category}
                </div>

                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setFocused(false);
                    }}
                    className="
                      flex w-full items-center
                      px-5 py-3
                      text-left
                      hover:bg-background-100
                    "
                  >
                    <span className="text-body1 text-background-700">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}