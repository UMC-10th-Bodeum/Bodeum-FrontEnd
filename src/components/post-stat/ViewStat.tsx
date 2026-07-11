import type { ReactNode } from "react";
import ViewsIcon from "@/assets/icons/Views.svg?react";
import StatItem from "./StatItem";

interface ViewStatProps {
    count: ReactNode;
}

function ViewStat({ count }: ViewStatProps) {
    return <StatItem icon={<ViewsIcon className="h-3 w-3" aria-hidden="true" />} value={count} />;
}

export default ViewStat;
