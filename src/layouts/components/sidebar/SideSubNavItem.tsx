interface SideSubNavItemProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function SideSubNavItem({
  label,
  selected = false,
  onClick,
}: SideSubNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left transition-colors
        ${
          selected
            ? "text-h6 text-background-600"
            : "text-h6-list text-background-500"
        }
      `}
    >
      {label}
    </button>
  );
}