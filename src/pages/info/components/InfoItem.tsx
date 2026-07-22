import Chip from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import CategoryLabel from "@/components/CategoryLabel";
import BaseInfoCard from "../../../components/BaseInfoCard";

import InfoItemInstitutionIcon from "@/assets/icons/InfoItem-institution.svg?react";
import InfoItemHospitalIcon from "@/assets/icons/InfoItem-hospital.svg?react";
import InfoItemWelfareIcon from "@/assets/icons/InfoItem-welfare.svg?react";
import InfoItemEmploymentIcon from "@/assets/icons/InfoItem-employment.svg?react";
import InfoItemEducationIcon from "@/assets/icons/Infoitem-education.svg?react";

import type { ParentCategory } from "@/types/info";
import type { ComponentType, SVGProps } from "react";

const noop = () => {};

const infoItemIconMap = {
  INSTITUTION: InfoItemInstitutionIcon,
  HOSPITAL: InfoItemHospitalIcon,
  WELFARE: InfoItemWelfareIcon,
  EDUCATION: InfoItemEducationIcon,
  EMPLOYMENT: InfoItemEmploymentIcon,
} satisfies Record<
  ParentCategory,
  ComponentType<SVGProps<SVGSVGElement>>
>;

const infoItemPressedBorderMap = {
  INSTITUTION: "peer-active:border-sub-yellow",
  HOSPITAL: "peer-active:border-main-400",
  WELFARE: "peer-active:border-sub-green",
  EDUCATION: "peer-active:border-sub-purple",
  EMPLOYMENT: "peer-active:border-sub-red",
} satisfies Record<ParentCategory, string>;

const infoItemIconSizeMap = {
  INSTITUTION: "h-[43.73px] w-[43.73px]",
  HOSPITAL: "h-[43.73px] w-[43.73px]",
  WELFARE: "h-[43.73px] w-[43.73px]",
  EDUCATION: "h-[43.73px] w-[43.73px]",
  EMPLOYMENT: "h-[43.73px] w-[43.73px]",
} satisfies Record<ParentCategory, string>;

interface InfoItemProps {
  mainCategory: ParentCategory;
  name: string;
  address: string;
  phone?: string;
  subCategoryKo: string;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
  onClick?: () => void;
  onScrapClick?: () => void;
}

export default function InfoItem({
  mainCategory,
  name,
  address,
  phone,
  subCategoryKo,
  viewCount,
  scrapCount,
  isScrapped = false,
  onClick,
  onScrapClick,
}: InfoItemProps) {
  const Icon = infoItemIconMap[mainCategory];
  const pressedBorderColor = infoItemPressedBorderMap[mainCategory];
  const iconSize = infoItemIconSizeMap[mainCategory];

  return (
    <BaseInfoCard
      pressedBorderColor={pressedBorderColor}
      onClick={onClick}
      icon={
        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[10px] bg-main-100">
          <Icon className={iconSize} />
        </div>
      }
      left={
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-[4px]">
            <CategoryLabel category={mainCategory} />
            <h3 className="truncate text-h2-list text-background-600">
              {name}
            </h3>
          </div>

          <p className="mt-1 truncate text-h6-list text-background-600">
            {address}
          </p>

          <p className="mt-0.5 truncate text-body-sub text-background-500">
            {subCategoryKo}
          </p>
        </div>
      }
      right={
        <div className="flex h-[64px] w-[130px] shrink-0 flex-col items-end justify-center gap-[11px]">
          <div className="flex h-[33px] w-full items-end justify-center">
            {phone && (
              <Chip variant="default" className="min-w-[100px]">
                {phone}
              </Chip>
            )}
          </div>

          <div className="flex h-5 w-full items-center justify-center gap-2">
            <ViewStat count={viewCount} />
            <span className="relative z-20 inline-flex h-5 items-center">
              <ScrapStat
                count={scrapCount}
                isActive={isScrapped}
                onClick={onScrapClick ?? noop}
              />
            </span>
          </div>
        </div>
      }
    />
  );
}