import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import CancelIcon from "@/assets/icons/Cancel-rounded.svg?react";
import NewsIcon from "@/assets/icons/searchNews.svg?react";
import CommunityIcon from "@/assets/icons/searchCommunity.svg?react";
import EmptySearchResult from "./search/EmptySearchResult";

interface Suggestion {
  text: string;
  type: string;
}

interface InputProps {
  searchType?: "news" | "community";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: (keyword: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions?: Suggestion[];
  onSuggestionClick?: (text: string) => void;
}

export default function Input({
  value,
  onChange,
  id,
  placeholder,
  search = false,
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
  onEnter,
  suggestions = [],
  onSuggestionClick,
  searchType,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(value.trim() !== "");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const wrapperStyle = search
    ? isFilled
      ? "border border-background-250 bg-main-100"
      : "border border-background-200 bg-background-200"
    : isFilled
      ? "border-0 bg-background-200 focus-within:border focus-within:border-main-400"
      : "border border-background-300 bg-background-200";

  const filteredSuggestions = suggestions.filter((item) =>
    searchType === "news"
      ? item.type === "NEWS_TITLE"
      : searchType === "community"
        ? item.type === "POST_TITLE" || item.type === "POST_CONTENT"
        : true,
  );

  // 검색어(value)나 제안 목록이 변경되면 인덱스 초기화
  useEffect(() => {
    setActiveIndex(null);
    setIsKeyboardNavigation(false);
    itemRefs.current = [];
  }, [value]);

  // activeIndex 변경 시 해당 위치로 자동 스크롤
  useEffect(() => {
    if (activeIndex === null) return;
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 외부에서 전달된 onKeyDown 먼저 실행
    onKeyDown?.(e);

    // 검색 모드가 아니거나 검색어가 2자 미만, 제안 목록이 없으면 기존 Enter 동작만 처리
    const isDropdownOpen = search && isFocused && value.trim().length >= 2;

    if (!isDropdownOpen) {
      if (search && e.key === "Enter") {
        setIsFilled(value.trim() !== "");
        (e.target as HTMLInputElement).blur();
        onEnter?.(value);
      }
      return;
    }

    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      if (filteredSuggestions.length === 0) return;

      setActiveIndex((prev) =>
        prev === null || prev === filteredSuggestions.length - 1 ? 0 : prev + 1,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      if (filteredSuggestions.length === 0) return;

      setActiveIndex((prev) =>
        prev === null || prev === 0 ? filteredSuggestions.length - 1 : prev - 1,
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex !== null && filteredSuggestions[activeIndex]) {
        const selectedText = filteredSuggestions[activeIndex].text;
        inputRef.current?.blur();
        setIsFilled(selectedText.trim() !== "");
        onSuggestionClick?.(selectedText);
      } else if (search) {
        setIsFilled(value.trim() !== "");
        inputRef.current?.blur();
        onEnter?.(value);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      setActiveIndex(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          flex ${search ? "h-[40px]" : "h-[48px]"} items-center rounded-[10px] px-[20px] transition-all ${wrapperStyle}
          focus-within:border-main-400
          focus-within:bg-background-100
        `}
      >
        {search && (
          <SearchIcon className="text-background-500 mr-[15px] h-[18px] w-[18px] shrink-0" />
        )}

        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e);
            if (!search) {
              setIsFilled(e.target.value.trim() !== "");
            }
          }}
          disabled={disabled}
          placeholder={isFocused ? "" : placeholder}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onKeyDown={handleKeyDown}
          className={`
            flex-1 bg-transparent
            ${search ? "text-h3-category-sub" : "text-h2-onboard"}
            text-background-600 outline-none
            ${search ? "placeholder:text-background-500" : "placeholder:text-background-400"}
          `}
        />

        {search && value.trim() !== "" && (
          <button
            type="button"
            onClick={() => {
              const event = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>;

              onChange(event);
              setIsFilled(false);
            }}
            className="ml-2 shrink-0"
          >
            <CancelIcon />
          </button>
        )}
      </div>

      {search && isFocused && value.trim().length >= 2 && (
        <div
          className="
            absolute left-0 right-0 top-[40px]
            z-50 mt-2
            max-h-[300px] overflow-y-auto overscroll-contain
            rounded-[10px]
            border border-background-200
            bg-background-100
            shadow-[1px_2px_15px_0px_#00000026]
            px-1 py-2
          "
        >
          {filteredSuggestions.length === 0 ? (
            <EmptySearchResult />
          ) : (
            filteredSuggestions.map((item, index) => {
              const Icon = item.type === "NEWS_TITLE" ? NewsIcon : CommunityIcon;

              const matchIndex = item.text.indexOf(value);
              const isActive = activeIndex === index;

              return (
                <button
                  key={`${item.type}-${item.text}-${index}`}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => setIsKeyboardNavigation(false)}
                  onClick={() => {
                    if (search) {
                      inputRef.current?.blur();
                    }
                    onSuggestionClick?.(item.text);
                  }}
                  className={`
                    flex w-full items-center
                    p-3
                    text-h3-category
                    rounded-[10px]
                    text-left outline-none
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
                  <Icon
                    className={`${searchType === "community" ? "mr-[11px]" : "mr-2"} shrink-0 text-background-400`}
                  />
                  {searchType === "community" ? (
                    <span
                      className="min-w-0 flex-1 truncate text-h3-category-sub text-background-400"
                      title={item.text}
                    >
                      {item.type === "POST_CONTENT" && "…"}
                      {matchIndex === -1 ? (
                        item.text
                      ) : (
                        <>
                          {item.text.slice(0, matchIndex)}
                          <span className="font-bold text-background-600">
                            {item.text.slice(matchIndex, matchIndex + value.length)}
                          </span>
                          {item.text.slice(matchIndex + value.length)}
                        </>
                      )}
                      {item.type === "POST_CONTENT" && "…"}
                    </span>
                  ) : matchIndex === -1 ? (
                    <span>{item.text}</span>
                  ) : (
                    <span className="text-background-500">
                      {item.text.slice(0, matchIndex)}
                      <span className="text-background-600 font-bold">
                        {item.text.slice(matchIndex, matchIndex + value.length)}
                      </span>
                      {item.text.slice(matchIndex + value.length)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
