import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";
import StatItem from "./StatItem";

interface DateStatProps {
    date: string;
    showLabel?: boolean;
}

function DateStat({ date, showLabel = false }: DateStatProps) {
    return (
        <StatItem
            icon={<UpdateAtIcon className="h-3 w-3" aria-hidden="true" />}
            label={showLabel ? "갱신" : undefined}
            value={date}
        />
    );
}

export default DateStat;
