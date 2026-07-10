import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import HeartPressedIcon from "@/assets/icons/HeartPressed.svg?react";
import ToggleStat from "./ToggleStat";

interface HeartStatProps {
    count: number;
    isActive?: boolean;
    onClick?: () => void;
}

function HeartStat({ count, isActive = false, onClick }: HeartStatProps) {
    return (
        <ToggleStat
            type="heart"
            isActive={isActive}
            count={count}
            onClick={onClick}
            gapClassName="gap-[1.25px]"
            outlineIcon={<HeartDisabledIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            filledIcon={<HeartIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            pressedIcon={<HeartPressedIcon className="h-3.5 w-3.5" aria-hidden="true" />}
        />
    );
}

export default HeartStat;
