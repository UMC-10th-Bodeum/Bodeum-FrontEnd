import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";
import StatItem from "./StatItem";

interface DateStatProps {
    date: string;
    showLabel?: boolean;
}

function DateStat({ date, showLabel = true }: DateStatProps) {
    return (
        <StatItem
            icon={<UpdateAtIcon className="h-[13px] w-[13px]" aria-hidden="true" />}
            label={showLabel ? "갱신" : undefined}
            value={date}
        />
    );
}

export default DateStat;
