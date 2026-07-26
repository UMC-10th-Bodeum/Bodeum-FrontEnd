import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

interface InfoCategoryProps {
  type: ParentCategory;
  count: number;
  selected?: boolean;
  onClick: () => void;
}

export default function InfoCategoryCard({
  type,
  count,
  selected = false,
  onClick,
}: InfoCategoryProps) {
  const { label, icon: Icon, bgColor } = infoCategoryMap[type];

  return (
    <button
      onClick={onClick}
      className={`flex w-[150px] shrink-0 cursor-pointer items-center gap-[12px] rounded-[8px] border bg-white px-[16px] py-[9px] transition hover:shadow-sm ${
        selected
          ? "border-background-500"
          : "border-background-250 active:border-background-500"
      } shadow-[#00000026]`}
    >
      <div
        className={`flex h-[40px] w-[40px] items-center justify-center rounded-[10px] ${bgColor}`}
      >
        <Icon className="h-[40px] w-[40px]" />
      </div>

      <div className="flex flex-col items-start gap-[3px]">
        <span className="text-h2-list text-background-600 leading-none">{label}</span>
        <span className="text-h4-list text-background-400 leading-none">+{count}</span>
      </div>
    </button>
  );
}