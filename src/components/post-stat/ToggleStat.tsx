import { useState, type ReactNode } from "react";

interface ToggleStatProps {
    type: "heart" | "scrap";
    isActive: boolean;
    count: number;
    onClick: () => void;
    outlineIcon: ReactNode;
    filledIcon: ReactNode;
    pressedIcon?: ReactNode;
    gapClassName?: string;
    ariaLabel: string;
}

const TOGGLE_STAT_COLOR_CLASS_NAME = {
    heart: {
        default: "text-background-500",
        enabled: "text-sub-red",
        pressed: "text-sub-red-2",
    },
    scrap: {
        default: "text-background-500",
        enabled: "text-background-600",
    },
} as const;

function ToggleStat({
    type,
    isActive,
    count,
    onClick,
    outlineIcon,
    filledIcon,
    pressedIcon,
    gapClassName = "gap-[5px]",
    ariaLabel,
}: ToggleStatProps) {
    const [isPressed, setIsPressed] = useState(false);
    const icon = isPressed && pressedIcon ? pressedIcon : isActive ? filledIcon : outlineIcon;
    const colorClassName =
        isPressed && type === "heart"
            ? TOGGLE_STAT_COLOR_CLASS_NAME[type].pressed
            : isActive
              ? TOGGLE_STAT_COLOR_CLASS_NAME[type].enabled
              : TOGGLE_STAT_COLOR_CLASS_NAME[type].default;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
            onPointerCancel={() => setIsPressed(false)}
            className={`inline-flex items-center cursor-pointer ${gapClassName} ${colorClassName}`}
        >
            <span className="pointer-events-none inline-flex shrink-0 items-center justify-center">
                {icon}
            </span>
            <span className="inline-flex items-center text-h4-list translate-y-[-1px]">
                {count.toLocaleString()}
            </span>
        </button>
    );
}

export default ToggleStat;
