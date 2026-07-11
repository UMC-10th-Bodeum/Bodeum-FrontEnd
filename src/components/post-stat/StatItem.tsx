import type { ReactNode } from "react";

interface StatItemProps {
    icon: ReactNode;
    value: ReactNode;
}

function StatItem({ icon, value }: StatItemProps) {
    return (
        <span className="inline-flex items-center gap-1 text-h6-list text-background-500">
            {icon}
            <span>{value}</span>
        </span>
    );
}

export default StatItem;
