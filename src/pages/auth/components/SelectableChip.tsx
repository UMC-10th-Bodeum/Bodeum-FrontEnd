import Chip from "@/components/Chips";

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function SelectableChip({
  label,
  selected,
  onClick,
  className,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="shrink-0 cursor-pointer rounded-[120px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
    >
      <Chip
        className={joinClassNames(
          "!h-[40px] !rounded-[120px] !border !px-[18px] !py-[8px] !text-h3-category-sub",
          selected
            ? "!border-main-400 !bg-main-200 !text-main-400"
            : "!border-background-300 !bg-background-100 !text-background-500",
          className,
        )}
      >
        {label}
      </Chip>
    </button>
  );
}
