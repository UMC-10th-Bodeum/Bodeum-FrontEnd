import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ButtonFillBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled"
> & {
  label?: string;
  disabled?: boolean;
};

type ButtonFillIconProps =
  | {
      icon?: undefined;
      iconPosition?: never;
    }
  | {
      icon: IconComponent;
      iconPosition: "left" | "right";
    };

export type ButtonFillProps = ButtonFillBaseProps & ButtonFillIconProps;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function ButtonFill({
  label = "후기 작성하기",
  disabled = false,
  icon: Icon,
  iconPosition,
  className,
  type = "button",
  ...buttonProps
}: ButtonFillProps) {
  if (Icon && !iconPosition) {
    throw new Error("ButtonFill: iconPosition is required when icon is provided.");
  }

  if (!Icon && iconPosition !== undefined) {
    throw new Error("ButtonFill: iconPosition cannot be used without icon.");
  }

  return (
    <button
      type={type}
      disabled={disabled}
      data-state={disabled ? "disabled" : "기본"}
      data-icon={Icon ? "true" : "false"}
      className={joinClassNames(
        "inline-flex h-[40px] shrink-0 items-center justify-center rounded-[10px] px-[16px] py-[10px]",
        Icon ? "gap-[4px]" : "gap-[6px]",
        "border-0 text-h4-list transition-[background-color,color,box-shadow] duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400",
        disabled
          ? "cursor-not-allowed bg-background-250 text-background-500"
          : "cursor-pointer bg-main-400 text-background-100 hover:bg-main-400 hover:shadow-button active:bg-main-500 active:shadow-none",
        className,
      )}
      {...buttonProps}
    >
      {Icon && iconPosition === "left" && (
        <Icon
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
      {Icon && iconPosition === "right" && (
        <Icon
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
    </button>
  );
}
