import { useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  onChange,
  placeholder,
  search = false,
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(value.trim() !== "");

  const wrapperStyle = search
    ? isFilled
      ? "border border-background-250 bg-main-100"
      : "border border-background-250 bg-background-200"
    : isFilled
      ? "border-0 bg-background-200 focus-within:border focus-within:border-main-400"
      : "border border-background-300 bg-background-200";

  return (
    <div
      className={`
        flex ${search ? "h-[44px]" : "h-[48px]"} items-center rounded-[10px]
        px-[20px]
        transition-all
        ${wrapperStyle}
        focus-within:border-main-400
        focus-within:bg-background-100
    ${className}
  `}
    >
      {search && (
        <SearchIcon className="mr-[15px] h-[18px] w-[18px] shrink-0" />
      )}

      <input
        value={value}
        onChange={(e) => {
          onChange(e);
          if (!search) {
            setIsFilled(e.target.value.trim() !== "");
          }
        }}
        disabled={disabled}
        placeholder={isFocused ? "" : placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (search && e.key === "Enter") {
            setIsFilled(value.trim() !== "");
            (e.target as HTMLInputElement).blur(); 
          }
        }}
        className={`
          w-full
          bg-transparent
          ${search ? "text-h3-category-sub" : "text-h2-onboard"}
          text-background-600
          outline-none
          ${search ? "placeholder:text-background-500" : "placeholder:text-background-400"}
        `}
      />
    </div>
  );
}