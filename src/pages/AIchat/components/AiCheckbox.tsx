import type { ChangeEventHandler, ReactNode } from "react";

import CheckboxBlankIcon from "@/assets/icons/CheckboxBlank.svg?react";
import CheckboxOutlineIcon from "@/assets/icons/CheckboxOutline.svg?react";

type AiCheckboxProps = {
  checked: boolean;
  label: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function AiCheckbox({
  checked,
  label,
  onChange,
  disabled = false,
  className,
  iconClassName,
  labelClassName,
}: AiCheckboxProps) {
  const Icon = checked ? CheckboxOutlineIcon : CheckboxBlankIcon;

  return (
    <label
      className={joinClassNames(
        "flex items-center",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <Icon
        aria-hidden="true"
        className={joinClassNames(
          "size-[24px] shrink-0 text-background-500",
          iconClassName,
        )}
      />
      <span className={labelClassName}>{label}</span>
    </label>
  );
}
