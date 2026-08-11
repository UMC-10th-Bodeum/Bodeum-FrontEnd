import ChoiceChip from "@/components/ChoiceChips";

type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type SelectableChipGroupProps<T extends string> = {
  legend: string;
  required?: boolean;
  options: Array<ChipOption<T>>;
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
};

export default function SelectableChipGroup<T extends string>({
  legend,
  required = false,
  options,
  value,
  onChange,
  className = "",
}: SelectableChipGroupProps<T>) {
  return (
    <fieldset className={className}>
      <legend className="text-h3-onboard text-background-500">
        {legend}
        {required && <span className="text-main-400">*</span>}
      </legend>
      <div className="mt-[12px] flex flex-wrap gap-[8px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={selected}
              onClick={() => onChange(option.value)}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
