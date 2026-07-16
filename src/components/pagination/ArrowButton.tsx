import LeftIcon from "@/assets/icons/ChevronLeft2.svg?react";
import RightIcon from "@/assets/icons/ChevronRight2.svg?react";

interface ArrowButtonProps {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
}

export default function ArrowButton({
  direction,
  disabled,
  onClick,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center gap-[4.66px]
        text-h6-list text-background-500
        cursor-pointer
        hover:border-b hover:border-background-500
        disabled:cursor-default
        disabled:border-0
        disabled:text-background-400
        ${direction === "prev" ? "mr-1" : "ml-1"}
      `}
    >
      {direction === "prev" && (
        <LeftIcon className="relative top-[1px]" />
      )}

      <span>{direction === "prev" ? "이전" : "다음"}</span>

      {direction === "next" && (
        <RightIcon className="relative top-[1px]" />
      )}
    </button>
  );
}