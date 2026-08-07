import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import HeartPressedIcon from "@/assets/icons/HeartPressed.svg?react";
import ToggleStat from "./ToggleStat";

interface HeartStatProps {
    count?: number;
    isActive?: boolean;
    onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
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
