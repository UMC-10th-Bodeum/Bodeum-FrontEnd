import { Select, type SelectProps } from "@/components/Select";

interface ProfileSelectProps extends SelectProps {
  changed: boolean;
  selected: boolean;
}

export default function ProfileSelect({
  changed,
  selected,
  triggerClassName,
  ...props
}: ProfileSelectProps) {
  const stateClassName = changed
    ? "!border-main-400 !bg-background-100 !text-background-500"
    : selected
      ? ""
      : "!border-background-250 !bg-background-200 !text-background-500 aria-expanded:!border-main-400 aria-expanded:!bg-background-100 aria-expanded:!text-background-500";

  return (
    <Select
      {...props}
      triggerClassName={`h-[44px] ${stateClassName} ${triggerClassName ?? ""}`}
    />
  );
}
