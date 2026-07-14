import type { ReactNode } from "react";

interface StatItemProps {
    icon: ReactNode;
    label?: string;
    value: number | string;
}

function StatItem({ icon, label, value }: StatItemProps) {
    const displayValue = typeof value === "number" ? value.toLocaleString() : value;

    return (
        <span className="inline-flex items-center gap-1 text-background-500">
            <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
            {label && <span className="text-body-sub">{label}</span>}
            <span className="translate-y-[-1px]  text-h4-list text-background-500">
                {displayValue}
            </span>
        </span>
    );
}

export default StatItem;
