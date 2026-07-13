import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartDisabledIcon from "@/assets/icons/HeartDisabled.svg?react";
import HeartPressedIcon from "@/assets/icons/HeartPressed.svg?react";
import ToggleStat from "./ToggleStat";

interface HeartStatProps {
    count: number;
    isActive?: boolean;
    onClick: () => void;
}

function HeartStat({ count, isActive = false, onClick }: HeartStatProps) {
    return (
        <ToggleStat
            type="heart"
            ariaLabel={isActive ? "좋아요 취소" : "좋아요"}
            isActive={isActive}
            count={count}
            onClick={onClick}
            gapClassName="gap-[1.5px]"
            outlineIcon={<HeartDisabledIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
            filledIcon={<HeartIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
            pressedIcon={<HeartPressedIcon className="h-[14px] w-[14px]" aria-hidden="true" />}
        />
    );
}

export default HeartStat;
