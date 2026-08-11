import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import ChevronLeft from "@/assets/icons/ChevronLeft.svg?react";
import { normalizeOptionIndex } from "./selectOptionIndex";

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectVariant = "L" | "S";

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  placeholder?: string;
  icon?: ReactNode;
  variant?: SelectVariant;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  initialScrollIndex?: number;
}

const triggerBaseClass =
  "flex w-full items-center justify-between gap-3 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background-600";

const triggerVariantClass: Record<SelectVariant, string> = {
  L: "h-[48px] rounded-[10px] p-3 text-h2-onboard",
  S: "h-[34px] rounded-[8px] py-2 pr-2 pl-3 text-h6-list",
};

const triggerHoverClass: Record<SelectVariant, string> = {
  L: "hover:bg-background-200 hover:border-background-400 hover:text-background-500",
  S: "hover:border-background-300 hover:text-background-500",
};

const triggerPlaceholderClass: Record<SelectVariant, Record<"true" | "false", string>> = {
  L: {
    true: "border-background-250 bg-background-200 text-background-500",
    false: "border-main-400 bg-background-100 text-background-600",
  },
  S: {
    true: "border-background-250 bg-background-100 text-background-500",
    false: "border-main-400 bg-background-100 text-background-600",
  },
};

const triggerOpenClass: Record<SelectVariant, string> = {
  L: "border-main-400 bg-background-100 text-background-500",
  S: "border-main-400 bg-background-100 text-background-500",
};

const dropdownVariantClass: Record<SelectVariant, string> = {
  L: "rounded-[10px]",
  S: "rounded-[8px]",
};

const dropdownMaxHeight: Record<SelectVariant, number> = {
  L: 416.42,
  S: 200,
};

const minDropdownMaxHeight = 80;
const dropdownViewportPadding = 16;
const dropdownGap = 10;

const optionBaseClass = "flex w-full items-center text-left transition-colors";

const optionVariantClass: Record<SelectVariant, string> = {
  L: "h-[40px] rounded-[4px] py-1 pr-2 pl-3 text-h2-onboard",
  S: "rounded-[4px] py-1 pr-2 pl-3 text-h6-list",
};

const optionHoverClass =
  "hover:bg-background-100 hover:text-background-500 hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)]";

const optionPressedClass = "active:bg-main-100 active:text-background-600";

const optionFocusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-background-600";

export function Select({
  options,
  value,
  onChange,
  id,
  ariaLabel,
  ariaLabelledby,
  placeholder = "선택",
  icon,
  variant = "S",
  disabled,
  className,
  triggerClassName: customTriggerClassName,
  dropdownClassName,
  initialScrollIndex,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDirection, setOpenDirection] = useState<"bottom" | "top">("bottom");
  const [maxHeight, setMaxHeight] = useState(dropdownMaxHeight[variant]);
  const reactId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const shouldFocusActiveOptionRef = useRef(false);
  const shouldCenterActiveOptionRef = useRef(false);
  const centerScrollFrameRef = useRef<number | null>(null);
  const cancelPendingCenterScroll = useCallback(() => {
    if (centerScrollFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(centerScrollFrameRef.current);
    centerScrollFrameRef.current = null;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        cancelPendingCenterScroll();
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cancelPendingCenterScroll, isOpen]);

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

    function handleScroll(e: Event) {
      if (e.target instanceof Node && dropdownRef.current?.contains(e.target)) {
        return;
      }

      updateDropdownSize();
    }

    updateDropdownSize();
    window.addEventListener("resize", updateDropdownSize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", updateDropdownSize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, variant]);

  const isPlaceholder = !value;
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : placeholder;
  const listboxId = `${id ?? reactId}-listbox`;
  const getInitialActiveIndex = () => {
    if (options.length === 0) {
      return 0;
    }

    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    return normalizeOptionIndex(initialScrollIndex, options.length);
  };
  const restoreTriggerFocus = () => {
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };
  const openListbox = (
    nextActiveIndex = getInitialActiveIndex(),
    shouldFocusActiveOption = false,
  ) => {
    if (options.length === 0) {
      return;
    }

    shouldFocusActiveOptionRef.current = shouldFocusActiveOption;
    shouldCenterActiveOptionRef.current =
      !shouldFocusActiveOption && initialScrollIndex !== undefined;
    setActiveIndex(nextActiveIndex);
    setIsOpen(true);
  };
  const closeListbox = (shouldRestoreFocus = false) => {
    cancelPendingCenterScroll();
    shouldFocusActiveOptionRef.current = false;
    shouldCenterActiveOptionRef.current = false;
    setIsOpen(false);

    if (shouldRestoreFocus) {
      restoreTriggerFocus();
    }
  };
  const focusOption = (nextActiveIndex: number, shouldFocusActiveOption = false) => {
    if (options.length === 0) {
      return;
    }

    const clampedIndex = Math.min(Math.max(nextActiveIndex, 0), options.length - 1);
    shouldFocusActiveOptionRef.current = shouldFocusActiveOption;
    setActiveIndex(clampedIndex);
  };
  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    closeListbox(true);
  };
  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (isOpen) {
          focusOption(activeIndex + 1, true);
        } else {
          openListbox(getInitialActiveIndex(), true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          focusOption(activeIndex - 1, true);
        } else {
          openListbox(selectedIndex >= 0 ? selectedIndex : options.length - 1, true);
        }
        break;
      case "Home":
        if (isOpen) {
          e.preventDefault();
          focusOption(0, true);
        }
        break;
      case "End":
        if (isOpen) {
          e.preventDefault();
          focusOption(options.length - 1, true);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen) {
          selectOption(options[activeIndex].value);
        } else {
          openListbox(getInitialActiveIndex(), true);
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          closeListbox(true);
        }
        break;
      default:
        break;
    }
  };
  const handleOptionKeyDown = (
    e: KeyboardEvent<HTMLLIElement>,
    optionValue: string,
    optionIndex: number,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusOption(optionIndex + 1, true);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusOption(optionIndex - 1, true);
        break;
      case "Home":
        e.preventDefault();
        focusOption(0, true);
        break;
      case "End":
        e.preventDefault();
        focusOption(options.length - 1, true);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectOption(optionValue);
        break;
      case "Escape":
        e.preventDefault();
        closeListbox(true);
        break;
      case "Tab":
        closeListbox();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (options.length === 0) {
      setIsOpen(false);
      return;
    }

    const nextActiveIndex = Math.min(activeIndex, options.length - 1);
    if (nextActiveIndex !== activeIndex) {
      setActiveIndex(nextActiveIndex);
      return;
    }

    if (shouldCenterActiveOptionRef.current) {
      shouldCenterActiveOptionRef.current = false;
      cancelPendingCenterScroll();
      centerScrollFrameRef.current = window.requestAnimationFrame(() => {
        centerScrollFrameRef.current = null;
        const activeOption = optionRefs.current[nextActiveIndex];
        const dropdown = dropdownRef.current;

        if (activeOption && dropdown) {
          dropdown.scrollTop = Math.max(
            0,
            activeOption.offsetTop -
              (dropdown.clientHeight - activeOption.offsetHeight) / 2,
          );
        }
      });
    }

    if (shouldFocusActiveOptionRef.current) {
      shouldFocusActiveOptionRef.current = false;
      const activeOption = optionRefs.current[nextActiveIndex];
      activeOption?.focus();
      activeOption?.scrollIntoView({ block: "nearest" });
    }

    return cancelPendingCenterScroll;
  }, [activeIndex, cancelPendingCenterScroll, isOpen, options.length]);

  const chevronClassName = [
    "shrink-0 text-background-500!",
    isOpen ? "rotate-90" : "-rotate-90",
  ].join(" ");
  const triggerClassName = [
    triggerBaseClass,
    triggerVariantClass[variant],
    disabled ? "" : "cursor-pointer",
    isOpen
      ? triggerOpenClass[variant]
      : [
          disabled ? "" : triggerHoverClass[variant],
          triggerPlaceholderClass[variant][String(isPlaceholder) as "true" | "false"],
        ].join(" "),
    customTriggerClassName ?? "",
  ].join(" ");
  const dropdownPositionClass =
    openDirection === "top" ? "bottom-full mb-[8px]" : "top-full mt-[8px]";

  return (
    <div ref={rootRef} className={`relative inline-block ${className ?? ""}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            closeListbox();
          } else {
            openListbox();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={triggerClassName}
      >
        <span className="flex min-w-0 items-center gap-0.5 overflow-hidden">
          {icon}
          <span className="truncate">{selectedLabel}</span>
        </span>

        <ChevronLeft className={chevronClassName} aria-hidden />
      </button>

      {isOpen && (
        <ul
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          style={{ maxHeight }}
          className={`absolute z-10 w-full overflow-x-hidden overflow-y-auto overscroll-contain border-[0.8px] border-background-250 bg-background-100 py-2 ${dropdownPositionClass} ${dropdownVariantClass[variant]} ${dropdownClassName ?? ""}`}
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              role="option"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={opt.value === value}
              onClick={() => selectOption(opt.value)}
              onMouseEnter={() => setActiveIndex(index)}
              onKeyDown={(e) => handleOptionKeyDown(e, opt.value, index)}
              className={`${optionBaseClass} ${optionVariantClass[variant]} ${optionHoverClass} ${optionPressedClass} ${optionFocusClass} cursor-pointer text-background-500`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
