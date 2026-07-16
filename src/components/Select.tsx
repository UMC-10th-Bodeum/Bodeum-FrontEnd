import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import ChevronLeft from "@/assets/icons/ChevronLeft.svg?react";

export interface SelectOption {
    label: string;
    value: string;
}

export type SelectVariant = "L" | "S";

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: ReactNode;
    variant?: SelectVariant;
    disabled?: boolean;
    className?: string;
}

const triggerBaseClass =
    "flex w-full items-center justify-between gap-3 border transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const triggerVariantClass: Record<SelectVariant, string> = {
    L: "h-[48px]  px-3 py-2 text-h2-onboard",
    S: "h-[34px] rounded-[5px] p-2 text-h6-list",
};

const triggerHoverClass: Record<SelectVariant, string> = {
    L: "hover:bg-background-200 hover:border-background-400 hover:text-background-500",
    S: "hover:border-background-400 hover:text-background-500",
};

const triggerPlaceholderClass: Record<SelectVariant, Record<"true" | "false", string>> = {
    L: {
        true: "rounded-[10px] border-background-250 bg-background-200 text-background-500",
        false: "rounded-[10px] border-main-400 bg-background-100 text-background-600",
    },
    S: {
        true: "border-background-250 bg-background-100 text-background-500",
        false: "border-main-400 bg-background-100 text-background-600",
    },
};

const triggerOpenClass: Record<SelectVariant, string> = {
    L: "rounded-[5px] border-main-400 bg-background-100 text-background-500",
    S: "border-main-400 bg-background-100 text-background-500",
};

const dropdownVariantClass: Record<SelectVariant, string> = {
    L: "rounded-[10px]",
    S: "rounded-[5px]",
};

const dropdownMaxHeight: Record<SelectVariant, number> = {
    L: 240,
    S: 200,
};

const minDropdownMaxHeight = 80;
const dropdownViewportPadding = 16;
const dropdownGap = 10;

const optionBaseClass = "flex w-full items-center text-left transition-colors";

const optionVariantClass: Record<SelectVariant, string> = {
    L: "h-[40px] rounded-[4px] px-2 py-1 text-h2-onboard",
    S: "rounded-[4px] px-2 py-1 text-h6-list",
};

const optionHoverClass =
    "hover:bg-background-100 hover:text-background-500 hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)]";

const optionPressedClass = "active:bg-main-100 active:text-background-600";

export function Select({
    options,
    value,
    onChange,
    placeholder = "선택",
    icon,
    variant = "S",
    disabled,
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDirection, setOpenDirection] = useState<"bottom" | "top">("bottom");
    const [maxHeight, setMaxHeight] = useState(dropdownMaxHeight[variant]);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function updateDropdownSize() {
            if (!rootRef.current) {
                return;
            }

            const rect = rootRef.current.getBoundingClientRect();
            const availableBottom =
                window.innerHeight - rect.bottom - dropdownGap - dropdownViewportPadding;
            const availableTop = rect.top - dropdownGap - dropdownViewportPadding;
            const shouldOpenTop =
                availableBottom < minDropdownMaxHeight && availableTop > availableBottom;
            const availableHeight = shouldOpenTop ? availableTop : availableBottom;
            const nextMaxHeight = Math.max(
                minDropdownMaxHeight,
                Math.min(dropdownMaxHeight[variant], availableHeight),
            );

            setOpenDirection(shouldOpenTop ? "top" : "bottom");
            setMaxHeight(nextMaxHeight);
        }

        updateDropdownSize();
        window.addEventListener("resize", updateDropdownSize);
        window.addEventListener("scroll", updateDropdownSize, true);

        return () => {
            window.removeEventListener("resize", updateDropdownSize);
            window.removeEventListener("scroll", updateDropdownSize, true);
        };
    }, [isOpen, variant]);

    const isPlaceholder = !value;
    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;
    const chevronClassName = [
        "shrink-0 !text-background-500",
        isOpen ? "rotate-90" : "-rotate-90",
    ].join(" ");
    const triggerClassName = [
        triggerBaseClass,
        triggerVariantClass[variant],
        isOpen
            ? triggerOpenClass[variant]
            : [
                  triggerHoverClass[variant],
                  triggerPlaceholderClass[variant][String(isPlaceholder) as "true" | "false"],
              ].join(" "),
    ].join(" ");
    const dropdownPositionClass =
        openDirection === "top" ? "bottom-full mb-[10px]" : "top-full mt-[10px]";

    return (
        <div ref={rootRef} className={`relative inline-block ${className ?? ""}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={triggerClassName}
            >
                <span className="flex min-w-0 items-center gap-0.5">
                    {icon}
                    {selectedLabel}
                </span>

                <ChevronLeft className={chevronClassName} aria-hidden />
            </button>

            {isOpen && (
                <ul
                    role="listbox"
                    style={{ maxHeight }}
                    className={`absolute z-10 w-full overflow-x-hidden overflow-y-auto overscroll-contain border-[0.8px] border-main-100 bg-background-100 py-2 ${dropdownPositionClass} ${dropdownVariantClass[variant]}`}
                >
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={opt.value === value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`${optionBaseClass} ${optionVariantClass[variant]} ${optionHoverClass} ${optionPressedClass} text-background-500`}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
