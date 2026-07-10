import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import ScrapPressedIcon from "@/assets/icons/ScrapPressed.svg?react";
import ToggleStat from "./ToggleStat";

interface BookmarkStatProps {
    count: number;
    isActive?: boolean;
    onClick?: () => void;
}

function BookmarkStat({ count, isActive = false, onClick }: BookmarkStatProps) {
    return (
        <ToggleStat
            type="bookmark"
            isActive={isActive}
            count={count}
            onClick={onClick}
            outlineIcon={<ScrapIcon className="h-3 w-3" aria-hidden="true" />}
            filledIcon={<ScrapPressedIcon className="h-3 w-3" aria-hidden="true" />}
        />
    );
}

export default BookmarkStat;
