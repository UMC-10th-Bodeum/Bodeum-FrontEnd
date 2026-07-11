import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";
import StatItem from "./StatItem";

interface DateStatProps {
    date: string;
}

function DateStat({ date }: DateStatProps) {
    return <StatItem icon={<UpdateAtIcon className="h-3 w-3" aria-hidden="true" />} value={date} />;
}

export default DateStat;
