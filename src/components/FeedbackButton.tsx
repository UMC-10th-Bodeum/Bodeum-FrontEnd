import {
    useState,
    type ButtonHTMLAttributes,
    type ComponentType,
    type SVGProps,
    type MouseEvent,
} from "react";

import GoodIcon from "@/assets/icons/Good.svg?react";
import BadIcon from "@/assets/icons/Bad.svg?react";

export type FeedbackType = "Good" | "Bad";
export type FeedbackVariant = "text" | "icon";

export interface FeedbackButtonProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "type"
> {
    feedbackType: FeedbackType;
    variant?: FeedbackVariant;
    selected?: boolean;
    defaultSelected?: boolean;
    count?: number;
    defaultCount?: number;
    showCount?: boolean;
    label?: string;
    onSelectedChange?: (selected: boolean, count: number) => void;
}

type FeedbackConfig = {
    label: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const feedbackConfig: Record<FeedbackType, FeedbackConfig> = {
    Good: { label: "도움돼요", Icon: GoodIcon },
    Bad: { label: "도움되지 않아요", Icon: BadIcon },
};

export default function FeedbackButton({
    feedbackType,
    variant = "text",
    selected: selectedProp,
    defaultSelected = false,
    count: countProp,
    defaultCount = 0,
    showCount = true,
    label,
    disabled = false,
    className,
    onClick,
    onSelectedChange,
    ...buttonProps
}: FeedbackButtonProps) {
    const { label: defaultLabel, Icon } = feedbackConfig[feedbackType];

    const [internalSelected, setInternalSelected] = useState(defaultSelected);
    const [internalCount, setInternalCount] = useState(defaultCount);

    const isControlled = selectedProp !== undefined;
    const selected = isControlled ? selectedProp : internalSelected;
    const count = countProp !== undefined ? countProp : internalCount;

    const buttonLabel = label ?? defaultLabel;
    const isIconVariant = variant === "icon";
    const shouldShowCount = !isIconVariant && showCount && count > 0;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const nextSelected = !selected;
        const nextCount = nextSelected ? count + 1 : Math.max(0, count - 1);

        if (!isControlled) {
            setInternalSelected(nextSelected);
            setInternalCount(nextCount);
        }
        onSelectedChange?.(nextSelected, nextCount);
        onClick?.(e);
    };

    return (
        <button
            {...buttonProps}
            type="button"
            disabled={disabled}
            onClick={handleClick}
            aria-label={isIconVariant ? buttonLabel : undefined}
            aria-pressed={selected}
            className={`
                self-start
                inline-flex items-center justify-center
                border-b border-transparent pb-0.5
                enabled:hover:border-current
                ${isIconVariant ? "w-5 h-5" : "h-5 gap-1 text-h6-list"}
                ${selected ? "text-main-400" : "text-background-500"}
                ${className ?? ""}
            `}
        >
            <Icon aria-hidden="true" className="shrink-0 w-5 h-5" />

            {!isIconVariant && (
                <span>
                    {buttonLabel}
                    {shouldShowCount && ` ${count}`}
                </span>
            )}
        </button>
    );
}
