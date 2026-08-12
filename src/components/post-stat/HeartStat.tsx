import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import HeartPressedIcon from "@/assets/icons/HeartPressed.svg?react";
import type { MouseEvent } from "react";
import StatItem from "./StatItem";
import ToggleStat from "./ToggleStat";

interface HeartStatProps {
  count?: number;
  isActive?: boolean;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
}

function HeartStat({
  count,
  isActive = false,
  onClick,
  disabled = false,
  label,
  ariaLabel,
}: HeartStatProps) {
  const icon = isActive ? (
    <HeartIcon className="h-[14px] w-[14px]" aria-hidden="true" />
  ) : (
    <HeartDisabledIcon className="h-[14px] w-[14px]" aria-hidden="true" />
  );

  if (!onClick) {
    return (
      <StatItem
        icon={icon}
        value={count ?? ""}
        label={label}
        ariaLabel={ariaLabel ?? `좋아요 ${count ?? 0}개`}
      />
    );
  }

  return (
    <ToggleStat
      type="heart"
      ariaLabel={ariaLabel ?? (isActive ? "좋아요 취소" : "좋아요")}
      isActive={isActive}
      count={count}
      label={label}
      onClick={onClick}
      disabled={disabled}
      outlineIcon={<HeartDisabledIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
      filledIcon={<HeartIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
      pressedIcon={<HeartPressedIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
    />
  );
}

export default HeartStat;
