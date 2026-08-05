import ChevronLeftIcon from "@/assets/icons/ChevronLeft.svg?react";
import type { ComponentType, SVGProps } from "react";
import { useNavigate } from "react-router-dom";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type DetailBackButtonTone = "default" | "danger";

interface DetailBackButtonProps {
  icon?: IconComponent | null;
  label?: string;
  onClick?: () => void;
  tone?: DetailBackButtonTone;
  selected?: boolean;
  selectedClassName?: string;
  className?: string;
  disabled?: boolean;
}

function DetailBackButton({
  icon: Icon = ChevronLeftIcon,
  label = "뒤로가기",
  onClick,
  tone = "default",
  selected,
  selectedClassName,
  className,
  disabled = false,
}: DetailBackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-[10px] border px-4 py-2 text-h4-list hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none ${
        selected && selectedClassName
          ? selectedClassName
          : tone === "danger"
            ? "border-sub-red bg-background-100 text-sub-red active:bg-sub-red active:border-background-100 active:text-background-100"
            : "border-background-300 bg-background-100 text-background-500 active:border-background-600 active:text-background-600"
      } ${className ?? ""}`}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className="bodeum-icon-color relative top-[1px] h-4 w-4"
        />
      )}
      {label}
    </button>
  );
}

export default DetailBackButton;
