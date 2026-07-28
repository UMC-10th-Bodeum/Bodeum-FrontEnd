import type { ButtonHTMLAttributes, ReactNode } from "react";

type AiSuggestChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  children: ReactNode;
  pressed?: boolean;
};

export default function AiSuggestChip({
  children,
  pressed = false,
  className,
  ...buttonProps
}: AiSuggestChipProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={pressed}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-main-400 px-[13px] py-[6px] text-h6-list text-main-400 transition-colors hover:bg-main-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
        pressed ? "bg-main-150" : "bg-background-100"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
