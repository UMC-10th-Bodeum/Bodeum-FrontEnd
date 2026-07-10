import BookmarkIcon from "@/assets/icons/Bookmark.svg?react";
import BookmarkFilledIcon from "@/assets/icons/BookmarkFilled.svg?react";
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
            outlineIcon={<BookmarkIcon className="h-3 w-3" aria-hidden="true" />}
            filledIcon={<BookmarkFilledIcon className="h-3 w-3" aria-hidden="true" />}
        />
    );
}

export default BookmarkStat;
