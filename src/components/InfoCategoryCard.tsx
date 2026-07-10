import {
  infoCategoryMap,
  type InfoCategoryType,
} from "@/constants/infoCategory";

interface InfoCategoryProps {
  type: InfoCategoryType;
  count: number;
  onClick?: () => void;
}

export default function InfoCategoryCard({
  type,
  count,
  onClick,
}: InfoCategoryProps) {
  const { label, icon: Icon, bgColor } = infoCategoryMap[type];

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[12px] rounded-[8px] border border-background-250 bg-white w-[150px] px-[16px] py-[9px] shadow-sm shadow-[#00000026] transition active:border-background-500 hover:shadow-md"
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