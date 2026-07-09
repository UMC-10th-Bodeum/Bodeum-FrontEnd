import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type ButtonOutlineSize = "default" | "L";
export type ButtonOutlineTone = "primary" | "black";

type ButtonOutlineBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled"
> & {
  label?: string;
  tone?: ButtonOutlineTone;
  disabled?: boolean;
};

type ButtonOutlineIconProps =
  | {
      size?: "default";
      icon?: undefined;
      iconPosition?: never;
    }
  | {
      size?: "default";
      icon: IconComponent;
      iconPosition: "left" | "right";
    }
  | {
      size: "L";
      icon?: never;
      iconPosition?: never;
    };

export type ButtonOutlineProps =
  ButtonOutlineBaseProps & ButtonOutlineIconProps;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

const enabledToneClasses: Record<ButtonOutlineTone, string> = {
  primary:
    "border-main-400 bg-background-100 text-main-400 hover:bg-main-150 active:border-main-400 active:bg-main-400 active:text-background-100",
  black:
    "border-background-500 bg-background-100 text-background-600 hover:bg-background-250 active:border-background-600 active:bg-background-600 active:text-background-100",
};

export default function ButtonOutline({
  label = "후기 작성하기",
  size = "default",
  tone = "primary",
  disabled = false,
  icon: Icon,
  iconPosition,
  className,
  type = "button",
  ...buttonProps
}: ButtonOutlineProps) {
  if (size === "L" && Icon) {
    throw new Error("ButtonOutline: icon cannot be used when size is L.");
  }

  if (size === "L" && iconPosition !== undefined) {
    throw new Error("ButtonOutline: iconPosition cannot be used when size is L.");
  }

  if (Icon && !iconPosition) {
    throw new Error("ButtonOutline: iconPosition is required when icon is provided.");
  }

  if (!Icon && iconPosition !== undefined) {
    throw new Error("ButtonOutline: iconPosition cannot be used without icon.");
  }

  const IconComponent = size === "default" ? Icon : undefined;

  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-tone={tone}
      data-state={disabled ? "disabled" : "기본"}
      data-icon-position={IconComponent ? iconPosition : undefined}
      className={joinClassNames(
        "inline-flex h-[38px] shrink-0 items-center justify-center rounded-[10px] border px-[16px] py-[10px]",
        "text-h6 transition-colors duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400",
        size === "L" ? "w-[632px] gap-[6px]" : "gap-[4px]",
        disabled
          ? "cursor-not-allowed border-background-400 bg-background-100 text-background-400"
          : joinClassNames("cursor-pointer", enabledToneClasses[tone]),
        className,
      )}
      {...buttonProps}
    >
      {IconComponent && iconPosition === "left" && (
        <IconComponent
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
      {IconComponent && iconPosition === "right" && (
        <IconComponent
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
    </button>
  );
}
