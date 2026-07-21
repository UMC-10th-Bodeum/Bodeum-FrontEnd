import FilterButton from "./FilterButton";
import ChevronDownIcon from "@/assets/icons/ChevronDown.svg?react";
import LocationSearchIcon from "@/assets/icons/LocationSearch.svg?react"

interface LocationButtonProps {
  value: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function LocationButton({
  value,
  onClick,
  disabled,
}: LocationButtonProps) {
  return (
    <FilterButton
      variant="location"
      disabled={disabled}
      onClick={onClick}
    >
      <LocationSearchIcon />
      <span>{value}</span>
      <ChevronDownIcon />
    </FilterButton>
  );
}