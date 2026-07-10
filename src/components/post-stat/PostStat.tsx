import ViewsIcon from "@/assets/icons/views.svg?react";
import BookmarkIcon from "@/assets/icons/Bookmark.svg?react";
import BookmarkFilledIcon from "@/assets/icons/BookmarkFilled.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";
import UpdateAtIcon from "@/assets/icons/updateAt.svg?react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HeartFilledIcon from "@/assets/icons/HeartFilled.svg?react";
import HeartPressedIcon from "@/assets/icons/HeartPressed.svg?react";
import StatItem from "./StatItem";
import ToggleStat from "./ToggleStat";

interface PostStatProps {
    viewCount?: number;
    commentCount?: number;
    date?: string;
    bookmarkCount?: number;
    likeCount?: number;
    isBookmarked?: boolean;
    isLiked?: boolean;
    onBookmarkClick?: () => void;
    onLikeClick?: () => void;
}

interface CountStatProps {
    count: number;
}

interface DateStatProps {
    date: string;
}

interface ToggleCountStatProps {
    count: number;
    isActive?: boolean;
    onClick?: () => void;
}

export function ViewStat({ count }: CountStatProps) {
    return <StatItem icon={<ViewsIcon className="h-3 w-3" aria-hidden="true" />} value={count} />;
}

export function CommentStat({ count }: CountStatProps) {
    return <StatItem icon={<CommentIcon className="h-3 w-3" aria-hidden="true" />} value={count} />;
}

export function DateStat({ date }: DateStatProps) {
    return <StatItem icon={<UpdateAtIcon className="h-3 w-3" aria-hidden="true" />} value={date} />;
}

export function BookmarkStat({ count, isActive = false, onClick }: ToggleCountStatProps) {
    return (
        <ToggleStat
            type="bookmark"
            isActive={isActive}
            count={count}
            onClick={onClick}
            outlineIcon={<BookmarkIcon className="size-3 shrink-0" aria-hidden="true" />}
            filledIcon={<BookmarkFilledIcon className="size-3 shrink-0" aria-hidden="true" />}
        />
    );
}

export function HeartStat({ count, isActive = false, onClick }: ToggleCountStatProps) {
    return (
        <ToggleStat
            type="heart"
            isActive={isActive}
            count={count}
            onClick={onClick}
            outlineIcon={<HeartIcon className="h-3 w-3" aria-hidden="true" />}
            filledIcon={<HeartFilledIcon className="h-3 w-3" aria-hidden="true" />}
            pressedIcon={<HeartPressedIcon className="h-3 w-3" aria-hidden="true" />}
        />
    );
}

function PostStat({
    viewCount,
    commentCount,
    date,
    bookmarkCount,
    likeCount,
    isBookmarked = false,
    isLiked = false,
    onBookmarkClick,
    onLikeClick,
}: PostStatProps) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
                {viewCount !== undefined && <ViewStat count={viewCount} />}
                {bookmarkCount !== undefined && (
                    <BookmarkStat
                        count={bookmarkCount}
                        isActive={isBookmarked}
                        onClick={onBookmarkClick}
                    />
                )}
                {commentCount !== undefined && <CommentStat count={commentCount} />}
                {date !== undefined && <DateStat date={date} />}
                {likeCount !== undefined && (
                    <HeartStat count={likeCount} isActive={isLiked} onClick={onLikeClick} />
                )}
            </div>
        </div>
    );
}

export default PostStat;
