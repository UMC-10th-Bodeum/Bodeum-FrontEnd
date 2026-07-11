import DetailBackButton from "@/components/DetailBackButton";
import RightIcon from "@/assets/icons/ChevronRight.svg?react";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function BackTopBar() {
  const { breadcrumb } = useBreadcrumb();
  
  return (
    <header className="flex h-[60px] items-center border-b border-background-250 bg-white px-[24px] py-[12px]">
      <DetailBackButton />

      <div className="flex items-center gap-[6px] ml-[20px]">
        {breadcrumb.map((item, index) => (
          <div key={item} className="flex items-center">
            {index > 0 && (
              <RightIcon className="mx-[8px] h-[7px] w-[3.5px] text-background-300" />
            )}

            <span className="text-h6-list text-gray-500">
              {item}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}