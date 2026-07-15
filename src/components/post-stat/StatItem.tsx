import type { ReactNode } from "react";

interface StatItemProps {
    icon: ReactNode;
    label?: string;
    value: number | string;
}

function StatItem({ icon, label, value }: StatItemProps) {
    const displayValue = typeof value === "number" ? value.toLocaleString() : value;

    return (
        <span className="inline-flex h-5 items-center gap-1 text-background-500">
            <span className="inline-flex shrink-0 items-center">{icon}</span>
            {label && <span className="text-body-sub">{label}</span>}
            <span className="translate-y-[-0.5px] text-h4-list leading-none">{displayValue}</span>
        </span>
    );
}

export default StatItem;
