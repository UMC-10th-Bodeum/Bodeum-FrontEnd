import type { ButtonHTMLAttributes } from "react";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

type CategoryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "aria-pressed" | "data-state"
> & {
  category: ParentCategory;
  selected?: boolean;
};

const categoryButtonClassMap = {
  INSTITUTION: {
    selectedBg: "bg-sub-yellow",
    pressedText: "active:text-sub-yellow",
    pressedRing: "active:ring-sub-yellow",
  },
  HOSPITAL: {
    selectedBg: "bg-main-400",
    pressedText: "active:text-main-400",
    pressedRing: "active:ring-main-400",
  },
  WELFARE: {
    selectedBg: "bg-sub-green",
    pressedText: "active:text-sub-green",
    pressedRing: "active:ring-sub-green",
  },
  EMPLOYMENT: {
    selectedBg: "bg-sub-red",
    pressedText: "active:text-sub-red",
    pressedRing: "active:ring-sub-red",
  },
  EDUCATION: {
    selectedBg: "bg-sub-purple",
    pressedText: "active:text-sub-purple",
    pressedRing: "active:ring-sub-purple",
  },
} satisfies Record<
  ParentCategory,
  {
    selectedBg: string;
    pressedText: string;
    pressedRing: string;
  }
>;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function CategoryButton({
  category,
  selected = false,
  className,
  type = "button",
  ...buttonProps
}: CategoryButtonProps) {
  const { label } = infoCategoryMap[category];
  const categoryButton = categoryButtonClassMap[category];

  return (
    <button
      {...buttonProps}
      type={type}
      aria-pressed={selected}
      data-state={selected ? "selected" : "default"}
      className={joinClassNames(
        "inline-flex h-[37px] shrink-0 items-center justify-center whitespace-nowrap rounded-[100px] px-[12px] py-[8px]",
        "text-h3-category-sub transition-[background-color,color,box-shadow,--tw-ring-color] duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400",
        selected
          ? `${categoryButton.selectedBg} text-background-100`
          : joinClassNames(
              "bg-main-100 text-background-500 hover:shadow-[1px_2px_15px_rgb(0_0_0_/_0.15)] active:bg-main-100 active:ring-1 active:ring-inset",
              categoryButton.pressedText,
              categoryButton.pressedRing,
            ),
        "cursor-pointer",
        className,
      )}
    >
      {label} 전체
    </button>
  );
}
