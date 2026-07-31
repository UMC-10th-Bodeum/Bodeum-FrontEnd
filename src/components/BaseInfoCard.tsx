import type { ReactNode } from "react";

interface BaseInfoCardProps {
  icon: ReactNode;
  left: ReactNode;
  right: ReactNode;
  onClick?: () => void;
  pressedBorderColor?: string;
}

export default function BaseInfoCard({
  icon,
  left,
  right,
  onClick,
  pressedBorderColor = "peer-active:border-main-400",
}: BaseInfoCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <article className="group relative isolate flex h-[102px] w-full items-center justify-between rounded-[10px] px-[20px] py-[12px]">
      {isClickable && (
        <button
          type="button"
          onClick={onClick}
          className="peer absolute inset-0 z-10 cursor-pointer rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
        />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[10px] border border-background-250 bg-background-100 transition ${
          isClickable
            ? `group-hover:shadow-[0.76px_1.51px_11.36px_0px_#00000026] ${pressedBorderColor}`
            : ""
        }`}
      />

      <div className="flex min-w-0 flex-1 items-center gap-4">
        {icon}
        {left}
      </div>

      {right}
    </article>
  );
}