import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import CancelIcon from "@/assets/icons/Cancel-rounded.svg?react";
import type { InfoSearchResult } from "@/types/search";
import SearchResultDropdown from "./SearchResultDropdown";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (!focused || value.trim() === "" || flatResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex((prev) => (prev === null || prev === flatResults.length - 1 ? 0 : prev + 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex((prev) => (prev === null || prev === 0 ? flatResults.length - 1 : prev - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex !== null && flatResults[activeIndex]) {
        handleSelectItem(flatResults[activeIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setFocused(false);
      setActiveIndex(null);
    }
  };

  const handleSelectItem = (item: InfoSearchResult) => {
    onSelect(item);
    setFocused(false);
    setActiveIndex(null);
  };

  useEffect(() => {
    setActiveIndex(null);
    setIsKeyboardNavigation(false);
    resultRefs.current = [];
  }, [value]);

  useEffect(() => {
    if (activeIndex === null) return;
    resultRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div ref={wrapperRef} className={`relative w-[921px] ${className}`}>
      <div
        className={`
          flex h-[40px] items-center rounded-[10px]
          border px-[20px]
          transition-colors
          ${focused ? "border-main-400 bg-background-100" : "border-background-200 bg-background-200"}
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
          className="w-full bg-transparent text-h3-category-sub text-background-700 placeholder:text-background-500 outline-none"
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
        <SearchResultDropdown
          grouped={grouped}
          flatResults={flatResults}
          keyword={value}
          activeIndex={activeIndex}
          isKeyboardNavigation={isKeyboardNavigation}
          onSelect={handleSelectItem}
          onMouseMove={() => setIsKeyboardNavigation(false)}
          resultRefs={resultRefs}
        />
      )}
    </div>
  );
}