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
        bg-background-600 text-background-100
        hover:shadow-[1px_2px_#00000026]
      `
      : `
        border-1 border-background-600 bg-background-100 text-background-600
        hover:shadow-[1px_2px_#00000026]
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