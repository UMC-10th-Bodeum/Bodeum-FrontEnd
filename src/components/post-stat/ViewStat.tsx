import ViewsIcon from "@/assets/icons/Views.svg?react";
import StatItem from "./StatItem";

interface ViewStatProps {
    count: number | string;
    showLabel?: boolean;
}

function ViewStat({ count, showLabel = false }: ViewStatProps) {
    return (
        <StatItem
            icon={<ViewsIcon className="h-3 w-3" aria-hidden="true" />}
            label={showLabel ? "조회" : undefined}
            value={count}
        />
    );
}

export default ViewStat;
