import Chip from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import InfoItemInstitutionIcon from "@/assets/icons/InfoItem-institution.svg?react";
import InfoItemHospitalIcon from "@/assets/icons/InfoItem-hospital.svg?react";
import InfoItemWelfareIcon from "@/assets/icons/InfoItem-welfare.svg?react";
import InfoItemEmploymentIcon from "@/assets/icons/InfoItem-employment.svg?react";
import InfoItemEducationIcon from "@/assets/icons/Infoitem-education.svg?react";
import InfoItemNewsIcon from "@/assets/icons/InfoItem-news.svg?react";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import type { ChipVariant } from "@/components/Chips";
import type { ComponentType, KeyboardEvent, ReactNode, SVGProps } from "react";

export type InfoItemCategory = ParentCategory | "PROGRAM";

const infoItemIconMap = {
    INSTITUTION: InfoItemInstitutionIcon,
    HOSPITAL: InfoItemHospitalIcon,
    WELFARE: InfoItemWelfareIcon,
    EDUCATION: InfoItemEducationIcon,
    EMPLOYMENT: InfoItemEmploymentIcon,
    PROGRAM: InfoItemNewsIcon,
} satisfies Record<InfoItemCategory, ComponentType<SVGProps<SVGSVGElement>>>;

const infoItemPressedBorderMap = {
    INSTITUTION: "active:border-sub-yellow",
    HOSPITAL: "active:border-main-500",
    WELFARE: "active:border-sub-green",
    EDUCATION: "active:border-sub-purple",
    EMPLOYMENT: "active:border-sub-red",
    PROGRAM: "active:border-main-400",
} satisfies Record<InfoItemCategory, string>;

const infoItemIconSizeMap = {
    INSTITUTION: "h-[43.73px] w-[43.73px]",
    HOSPITAL: "h-[43.73px] w-[43.73px]",
    WELFARE: "h-[43.73px] w-[43.73px]",
    EDUCATION: "h-[43.73px] w-[43.73px]",
    EMPLOYMENT: "h-[43.73px] w-[43.73px]",
    PROGRAM: "h-[60px] w-[60px]",
} satisfies Record<InfoItemCategory, string>;

const programCategoryInfo = {
    label: "프로그램",
    bgColor: "bg-background-200",
    textColor: "text-background-600",
} as const;

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
    onNavigate?: () => void;
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
    onNavigate,
    onScrapClick,
}: InfoItemProps) {
    const { label, bgColor, textColor } =
        type === "PROGRAM" ? programCategoryInfo : infoCategoryMap[type];
    const Icon = infoItemIconMap[type];
    const pressedBorderColor = infoItemPressedBorderMap[type];
    const iconSize = infoItemIconSizeMap[type];
    const isClickable = Boolean(onClick || onNavigate);

    const handleClick = () => {
        onClick?.();
        onNavigate?.();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!isClickable) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <article
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={handleKeyDown}
            className={`flex h-[102px] w-[578px] items-center justify-between rounded-[10px] border border-background-250 bg-background-100 px-[20px] py-[12px] transition hover:shadow-[0.76px_1.51px_11.36px_0px_#00000026] ${pressedBorderColor} ${isClickable ? "cursor-pointer" : ""}`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[10px] bg-main-100">
                    <Icon className={iconSize} />
                </div>

                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-[4px]">
                        <span
                            className={`shrink-0 rounded-[10px] ${bgColor} px-2 py-0.5 text-h5-list leading-none ${textColor}`}
                        >
                            {label}
                        </span>
                        <h3 className="truncate text-h2-list text-background-600">{name}</h3>
                    </div>

                    <p className="mt-1 truncate text-h6-list text-background-600">{address}</p>
                    <p className="mt-0.5 truncate text-body-sub text-background-500">
                        {services.join(" · ")}
                    </p>
                </div>
            </div>

            <div className="flex h-[64px] w-[130px] shrink-0 flex-col items-end justify-center gap-[11px]">
                <div className="flex h-[33px] w-full items-end justify-center">
                    {chipText && <Chip variant={chipVariant}>{chipText}</Chip>}
                </div>

                <div className="flex h-5 w-full items-center justify-center gap-2">
                    <ViewStat count={viewCount} />
                    <span
                        className="inline-flex h-5 items-center"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                    >
                        <ScrapStat
                            count={scrapCount}
                            isActive={isScrapped}
                            onClick={onScrapClick ?? (() => {})}
                        />
                    </span>
                </div>
            </div>
        </article>
    );
}
