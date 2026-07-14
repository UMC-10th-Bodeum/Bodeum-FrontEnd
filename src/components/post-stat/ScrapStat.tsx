import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import ToggleStat from "./ToggleStat";

interface ScrapStatProps {
    count: number;
    isActive?: boolean;
    onClick: () => void;
}

function ScrapStat({ count, isActive = false, onClick }: ScrapStatProps) {
    return (
        <ToggleStat
            type="scrap"
            ariaLabel={isActive ? "스크랩 취소" : "스크랩"}
            isActive={isActive}
            count={count}
            onClick={onClick}
            outlineIcon={<ScrapIcon className="bodeum-icon-color h-3 w-3" aria-hidden="true" />}
            filledIcon={<ScrapPressedIcon className="h-3 w-3" aria-hidden="true" />}
        />
    );
}

export default ScrapStat;
