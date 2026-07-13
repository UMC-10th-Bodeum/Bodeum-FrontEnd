import { diagnosisMap } from "@/constants/diagnosis";
import type { DiagnosisType } from "@/types/diagnosis";

type PostTagProps =
  | {
    type: Exclude<DiagnosisType, "ETC">;
  }
  | {
    type: "ETC";
    label?: string;
  };

export default function PostTag(props: PostTagProps) {
  const { className, label: defaultLabel } = diagnosisMap[props.type];

  const label =
    props.type === "ETC"
      ? props.label ?? defaultLabel
      : defaultLabel;

  return (
    <span
      className={`inline-flex h-[18px] items-center justify-center rounded-[100px] px-[8px] text-body-label ${className}`}
    >
      {label}
    </span>
  );
}