import type { ReactNode } from "react";

interface StatItemProps {
  icon: ReactNode;
  label?: string;
  ariaLabel?: string;
  value: number | string;
}

function StatItem({ icon, label, value, ariaLabel }: StatItemProps) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <span className="inline-flex h-5 items-center gap-1 text-background-500" aria-label={ariaLabel}>
      <span className="inline-flex shrink-0 items-center">{icon}</span>
      {label && (
        <span className="text-body-sub" aria-hidden={ariaLabel ? "true" : undefined}>
          {label}
        </span>
      )}
      <span
        className="translate-y-[-0.5px] text-h4-list leading-none"
        aria-hidden={ariaLabel ? "true" : undefined}
      >
        {displayValue}
      </span>
    </span>
  );
}

export default StatItem;
