import DetailBackButton from "@/components/button/DetailBackButton";
import RightIcon from "@/assets/icons/ChevronRight.svg?react";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function BackTopBar() {
  const { breadcrumb } = useBreadcrumb();
  
  return (
    <header className="flex h-[60px] items-center border-b border-background-250 bg-white px-[24px] py-[12px]">
      <DetailBackButton />

      <div className="flex items-center ml-[20px]">
        {breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <RightIcon className="mx-[11.25px] h-[7px] w-[3.5px] text-background-300" />
            )}

            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-h6-list text-background-500 cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-h6-list text-background-500">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}