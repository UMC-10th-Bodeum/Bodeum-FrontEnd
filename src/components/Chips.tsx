import { type ReactNode } from "react";

export type ChipVariant = "default" | "dday" | "recruit";

interface ChipProps {
    children: ReactNode;
    variant?: ChipVariant;
    className?: string;
}

const VARIANT_STYLES: Record<ChipVariant, string> = {
    default: "bg-main-100 text-background-600",
    dday: "bg-sub-red-2 text-sub-red",
    recruit: "bg-sub-green-2 text-sub-green",
};

export default function Chip({ children, variant = "default", className = "" }: ChipProps) {
    return (
        <span
            className={`inline-flex h-[21px] items-center justify-center whitespace-nowrap rounded-[8px] px-2 py-0.5 text-h4-list ${VARIANT_STYLES[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
