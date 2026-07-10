import CommentIcon from "@/assets/icons/comment.svg?react";
import StatItem from "./StatItem";

interface CommentStatProps {
    count: number;
}

function CommentStat({ count }: CommentStatProps) {
    return <StatItem icon={<CommentIcon className="h-3 w-3" aria-hidden="true" />} value={count} />;
}

export default CommentStat;
