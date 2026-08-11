import CommunityIcon from "@/assets/icons/Community.svg?react";
import StatItem from "./StatItem";

interface CommentStatProps {
  count: number | string;
  showLabel?: boolean;
}

function CommentStat({ count, showLabel = false }: CommentStatProps) {
  return (
    <StatItem
      icon={<CommunityIcon className="h-3 w-3" aria-hidden="true" />}
      label={showLabel ? "리뷰" : undefined}
      ariaLabel={showLabel ? undefined : `리뷰 ${count}`}
      value={count}
    />
  );
}

export default CommentStat;
