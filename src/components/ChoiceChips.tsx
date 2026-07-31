import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChoiceChipsProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-pressed"
> & {
  label: ReactNode;
  selected?: boolean;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function ChoiceChips({
  label,
  selected = false,
  disabled = false,
  className,
  type = "button",
  ...buttonProps
}: ChoiceChipsProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled}
      aria-pressed={selected}
      data-state={selected ? "selected" : "default"}
      className={joinClassNames(
        "inline-flex h-[40px] max-w-full shrink-0 items-center justify-center whitespace-nowrap rounded-[120px] border px-[18px] py-2",
        "text-h3-category-sub",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400",
        selected
          ? "border-main-400 bg-main-200 text-main-400"
          : "border-background-300 bg-background-100 text-background-500",
        disabled
          ? "cursor-default"
          : "cursor-pointer active:border-t-[0.96px]! active:border-t-main-400! active:bg-main-400! active:text-background-100!",
        className,
      )}
    >
      {label}
    </button>
  );
}
