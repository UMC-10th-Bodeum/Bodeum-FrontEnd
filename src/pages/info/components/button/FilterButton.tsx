interface FilterButtonProps {
  children: React.ReactNode;
  variant: "location" | "category";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function FilterButton({
  children,
  variant,
  disabled = false,
  onClick,
  className = "",
}: FilterButtonProps) {
  let style = "";

  if (disabled) {
    style = "bg-background-100 text-gray-400 cursor-not-allowed";
  } else if (variant === "location") {
    style = "bg-background-200 hover:shadow-sm";
  } else {
    style = "hover:shadow-sm";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[48px] items-center justify-between gap-3 rounded-[10px] px-[12px] text-h2-list transition-all ${style} ${className}`}
    >
      {children}
    </button>
  );
}