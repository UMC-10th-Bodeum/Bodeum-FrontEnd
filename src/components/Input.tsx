import { useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import CancelIcon from "@/assets/icons/Cancel-rounded.svg?react";
import NewsIcon from "@/assets/icons/searchNews.svg?react";
import CommunityIcon from "@/assets/icons/searchCommunity.svg?react"; 

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
  const inputRef = useRef<HTMLInputElement>(null);

  const wrapperStyle = search
    ? isFilled
      ? "border border-background-250 bg-main-100"
      : "border border-background-200 bg-background-200"
    : isFilled
      ? "border-0 bg-background-200 focus-within:border focus-within:border-main-400"
      : "border border-background-300 bg-background-200";
  
  function EmptySearchResult() {
    return (
      <div className="flex flex-col items-center justify-center py-[25.5px]">
        <SearchIcon className="mb-3 h-[50px] w-[50px] text-background-300" />

        <p className="text-h3-category-sub text-background-700">
          검색결과가 없어요
        </p>

        <p className="text-h6 text-background-400">
          검색어를 변경해보세요
        </p>
      </div>
    );
  }

  const filteredSuggestions = suggestions.filter((item) =>
    searchType === "news"
    ? item.type === "NEWS_TITLE"
    : searchType === "community"
      ? item.type === "COMMUNITY_TITLE"
      : true
  );

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
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (search && e.key === "Enter") {
              setIsFilled(value.trim() !== "");
              (e.target as HTMLInputElement).blur();
              onEnter?.(value);
            }
          }}
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
      {search &&
        isFocused &&
        value.trim().length >= 2 && (
          <div
            className="
              absolute left-0 right-0 top-[40px]
              z-50 mt-2
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
              filteredSuggestions.map((item) => {
                const Icon =
                  item.type === "NEWS_TITLE" ? NewsIcon : CommunityIcon;
              
                const index = item.text.indexOf(value);

                return (
                  <button
                    key={item.text}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (search) {
                        inputRef.current?.blur();
                      }

                      onSuggestionClick?.(item.text);
                    }}
                    className="
                    flex w-full items-center
                    p-3
                    hover:bg-background-200
                    text-h3-category
                    rounded-[10px]
                  "
                  >
                    <Icon className="mr-2 text-background-400" />
                    {index === -1 ? (
                      <span>{item.text}</span>
                    ) : (
                      <span className="text-background-500">
                        {item.text.slice(0, index)}
                        <span className="text-background-600">
                          {item.text.slice(index, index + value.length)}
                        </span>
                        {item.text.slice(index + value.length)}
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
