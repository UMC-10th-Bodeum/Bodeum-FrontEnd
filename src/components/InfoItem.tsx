import Chip from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import InfoItemInstitutionIcon from "@/assets/icons/InfoItem-institution.svg?react";
import InfoItemHospitalIcon from "@/assets/icons/InfoItem-hospital.svg?react";
import InfoItemWelfareIcon from "@/assets/icons/InfoItem-welfare.svg?react";
import InfoItemEmploymentIcon from "@/assets/icons/InfoItem-employment.svg?react";
import InfoItemEducationIcon from "@/assets/icons/Infoitem-education.svg?react";
import InfoItemNewsIcon from "@/assets/icons/InfoItem-news.svg?react";
import type { ParentCategory } from "@/types/info";
import type { ChipVariant } from "@/components/Chips";
import type { ComponentType, ReactNode, SVGProps } from "react";
import CategoryLabel from "@/components/CategoryLabel";

export type InfoItemCategory = ParentCategory | "PROGRAM";

const infoItemIconMap = {
  INSTITUTION: InfoItemInstitutionIcon,
  HOSPITAL: InfoItemHospitalIcon,
  WELFARE: InfoItemWelfareIcon,
  EDUCATION: InfoItemEducationIcon,
  EMPLOYMENT: InfoItemEmploymentIcon,
  PROGRAM: InfoItemNewsIcon,
} satisfies Record<InfoItemCategory, ComponentType<SVGProps<SVGSVGElement>>>;

const programCategoryInfo = {
  label: "프로그램",
  bgColor: "bg-background-200",
  textColor: "text-background-600",
  pressedBorderColor: "peer-active:border-main-400",
} as const;

const infoItemPressedBorderMap = {
  INSTITUTION: "peer-active:border-sub-yellow",
  HOSPITAL: "peer-active:border-main-400",
  WELFARE: "peer-active:border-sub-green",
  EDUCATION: "peer-active:border-sub-purple",
  EMPLOYMENT: "peer-active:border-sub-red",
  PROGRAM: programCategoryInfo.pressedBorderColor,
} satisfies Record<InfoItemCategory, string>;

const infoItemIconSizeMap = {
  INSTITUTION: "h-[43.73px] w-[43.73px]",
  HOSPITAL: "h-[43.73px] w-[43.73px]",
  WELFARE: "h-[43.73px] w-[43.73px]",
  EDUCATION: "h-[43.73px] w-[43.73px]",
  EMPLOYMENT: "h-[43.73px] w-[43.73px]",
  PROGRAM: "h-[60px] w-[60px]",
} satisfies Record<InfoItemCategory, string>;

const noop = () => {};

interface InfoItemProps {
  type: InfoItemCategory;
  name: string;
  address: string;
  services: string[];
  chipText?: ReactNode;
  chipVariant?: ChipVariant;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
  onClick?: () => void;
  onScrapClick?: () => void;
}

export default function InfoItem({
  type,
  name,
  address,
  services,
  chipText,
  chipVariant = "default",
  viewCount,
  scrapCount,
  isScrapped = false,
  onClick,
  onScrapClick,
}: InfoItemProps) {
  const isProgram = type === "PROGRAM";
  const Icon = infoItemIconMap[type];
  const pressedBorderColor = infoItemPressedBorderMap[type];
  const iconSize = infoItemIconSizeMap[type];
  const isClickable = Boolean(onClick);
  const interactiveSurfaceStyle = isClickable
    ? `group-hover:shadow-[0.76px_1.51px_11.36px_0px_#00000026] ${pressedBorderColor}`
    : "";

  return (
    <article className="group relative isolate flex h-[102px] w-full items-center justify-between rounded-[10px] px-[20px] py-[12px]">
      {isClickable && (
        <button
          type="button"
          onClick={onClick}
          aria-label={`${name} detail view`}
          className="peer absolute inset-0 z-10 cursor-pointer rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
        />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[10px] border border-background-250 bg-background-100 transition ${interactiveSurfaceStyle}`}
      />

      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[10px] bg-main-100">
          <Icon className={iconSize} />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-[4px]">
            {isProgram ? (
              <span
                className={`shrink-0 rounded-[10px] ${programCategoryInfo.bgColor} px-2 py-[4px] text-h5-list leading-none ${programCategoryInfo.textColor}`}
              >
                {programCategoryInfo.label}
              </span>
            ) : (
              <CategoryLabel category={type} />
            )}
            <h3 className="truncate text-h2-list text-background-600">{name}</h3>
          </div>

          <p className="mt-1 truncate text-h6-list text-background-600">{address}</p>
          {services.length > 0 && (
            <p className="mt-0.5 truncate text-body-sub text-background-500">
              {services.join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-[64px] w-[130px] shrink-0 flex-col items-end justify-center gap-[11px]">
        <div className="flex h-[33px] w-full items-end justify-center">
          {chipText && (
            <Chip variant={chipVariant} className="min-w-[100px]">
              {chipText}
            </Chip>
          )}
        </div>

        <div className="flex h-5 w-full items-center justify-center gap-2">
          <ViewStat count={viewCount} />
          <span className="relative z-20 inline-flex h-5 items-center">
            <ScrapStat count={scrapCount} isActive={isScrapped} onClick={onScrapClick ?? noop} />
          </span>
        </div>
      </div>
    </article>
  );
}
