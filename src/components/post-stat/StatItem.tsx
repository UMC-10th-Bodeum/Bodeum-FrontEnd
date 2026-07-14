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
            {/* 숫자 폰트가 아이콘보다 아래로 보여 0.5px 위로 광학 보정 */}
            <span className="translate-y-[-0.5px] text-h4-list leading-none">{displayValue}</span>
        </span>
    );
}

export default StatItem;
