import ChevronLeftIcon from "@/assets/icons/ChevronLeft.svg?react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
    to?: string;
    label?: string;
}

function DetailBackButton({ to, label = "뒤로가기" }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to !== undefined) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center cursor-pointer gap-2 rounded-[10px] border border-background-300 bg-background-100 px-4 py-2 text-h4-list text-background-500 hover:border-background-300 hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)] active:border-background-600 active:bg-background-600 active:text-background-100"
        >
            <ChevronLeftIcon aria-hidden="true" className="h-4 w-4 relative top-[1px]" />
            {label}
        </button>
    );
}

export default DetailBackButton;
