import type { ReactNode } from "react";
import CommunityIcon from "@/assets/icons/Community.svg?react";
import StatItem from "./StatItem";

interface CommentStatProps {
    count: ReactNode;
}

function CommentStat({ count }: CommentStatProps) {
    return (
        <StatItem icon={<CommunityIcon className="h-3 w-3" aria-hidden="true" />} value={count} />
    );
}

export default CommentStat;
