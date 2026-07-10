import ViewsIcon from "@/assets/icons/views.svg?react";
import StatItem from "./StatItem";

interface ViewStatProps {
    count: number;
}

function ViewStat({ count }: ViewStatProps) {
    return <StatItem icon={<ViewsIcon className="h-3 w-3" aria-hidden="true" />} value={count} />;
}

export default ViewStat;
