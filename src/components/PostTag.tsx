import { diagnosisMap } from "@/constants/diagnosis";
import type { DiagnosisType } from "@/types/diagnosis";

interface PostTagProps {
  type: DiagnosisType;
}

export default function PostTag({ type }: PostTagProps) {
  const { label, className } = diagnosisMap[type];

  return (
    <span
      className={`inline-flex h-[18px] items-center justify-center rounded-[100px] px-[8px] text-body-label ${className}`}
    >
      {label}
    </span>
  );
}