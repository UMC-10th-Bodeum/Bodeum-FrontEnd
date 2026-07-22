import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerTop?: ReactNode; 
}

export default function Section({
  title,
  icon,
  children,
  headerTop,
  className = "",
}: SectionProps) {
  return (
    <section
      className={`w-[680px] rounded-[10px] border border-background-250 bg-background-100 px-[24px] py-[20px] ${className}`}
    >
      {headerTop && <div className="mb-[14px]">{headerTop}</div>}
      <div className="mb-[14px] flex items-center gap-[4px]">
        {icon}
        <h2 className="text-h2-list text-background-600">{title}</h2>
      </div>
      {children}
    </section>
  );
}