interface OnboardButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function OnboardButton({
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
}: OnboardButtonProps) {
  const baseStyle =
    "w-[148px] py-[5px] rounded-[8px] text-h6 transition-all duration-200";

  const variantStyle =
    variant === "primary"
      ? `
        bg-main-400 text-background-100
        hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)]
      `
      : `
        border-1 border-background-400 bg-background-100 text-background-400
        hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)]
      `;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
}