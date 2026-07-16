/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { ComponentType, SVGProps } from "react";
import type { Root } from "react-dom/client";

import ToastBlueIcon from "@/assets/icons/ToastBlue.svg?react";
import ToastCheckIcon from "@/assets/icons/ToastCheck.svg?react";
import ToastCloseIcon from "@/assets/icons/ToastClose.svg?react";
import ToastErrorIcon from "@/assets/icons/ToastError.svg?react";
import ToastWarningIcon from "@/assets/icons/ToastWarning.svg?react";

export type ToastColor = "blue" | "green" | "red" | "yellow";

type ToastProps = {
  color: ToastColor;
  message: string;
};

type StatusIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ToastAnimationStatus = "entering" | "visible" | "closing";

type ToastItem = {
  id: number;
  color: ToastColor;
  message: string;
  status: ToastAnimationStatus;
};

type ToastStyle = {
  borderClassName: string;
  textClassName: string;
  iconBgClassName?: string;
  Icon: StatusIconComponent;
};

const toastStyleMap: Record<ToastColor, ToastStyle> = {
  blue: {
    borderClassName: "border-main-400",
    textClassName: "text-main-400",
    Icon: ToastBlueIcon,
  },
  green: {
    borderClassName: "border-sub-green",
    textClassName: "text-sub-green",
    iconBgClassName: "bg-sub-green",
    Icon: ToastCheckIcon,
  },
  red: {
    borderClassName: "border-sub-red",
    textClassName: "text-sub-red",
    iconBgClassName: "bg-sub-red",
    Icon: ToastErrorIcon,
  },
  yellow: {
    borderClassName: "border-sub-yellow",
    textClassName: "text-sub-yellow",
    iconBgClassName: "bg-sub-yellow",
    Icon: ToastWarningIcon,
  },
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

const MAX_TOAST_COUNT = 5;
const TOAST_DURATION_MS = 2000;
const TOAST_EXIT_MS = 220;

let nextToastId = 0;
let toastRoot: Root | null = null;
let toastRootElement: HTMLDivElement | null = null;
let toasts: ToastItem[] = [];

const toastTimers = new Map<
  number,
  Array<ReturnType<typeof window.setTimeout>>
>();

function ensureToastRoot() {
  if (typeof document === "undefined") {
    return;
  }

  if (!toastRootElement) {
    toastRootElement = document.createElement("div");
    toastRootElement.id = "bodeum-toast-root";
    document.body.appendChild(toastRootElement);
    toastRoot = createRoot(toastRootElement);
  }
}

function renderToastRoot() {
  ensureToastRoot();
  toastRoot?.render(<ToastViewport toasts={toasts} onClose={closeToast} />);
}

function clearToastTimers(id: number) {
  const timers = toastTimers.get(id);

  if (timers) {
    timers.forEach((timer) => window.clearTimeout(timer));
    toastTimers.delete(id);
  }
}

function removeToast(id: number) {
  clearToastTimers(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  renderToastRoot();
}

function closeToast(id: number) {
  clearToastTimers(id);
  toasts = toasts.map((toast) =>
    toast.id === id ? { ...toast, status: "closing" } : toast,
  );
  renderToastRoot();

  const removeTimer = window.setTimeout(() => {
    removeToast(id);
  }, TOAST_EXIT_MS);

  toastTimers.set(id, [removeTimer]);
}

export function showToast(color: ToastColor, message: string) {
  const id = nextToastId + 1;
  nextToastId = id;

  const overflowCount = Math.max(0, toasts.length - (MAX_TOAST_COUNT - 1));
  const removedToasts = toasts.slice(0, overflowCount);

  removedToasts.forEach((toast) => clearToastTimers(toast.id));

  toasts = [
    ...toasts.slice(overflowCount),
    {
      id,
      color,
      message,
      status: "entering",
    },
  ];
  renderToastRoot();

  const enterTimer = window.setTimeout(() => {
    toasts = toasts.map((toast) =>
      toast.id === id ? { ...toast, status: "visible" } : toast,
    );
    renderToastRoot();
  }, 20);

  const durationTimer = window.setTimeout(() => {
    closeToast(id);
  }, TOAST_DURATION_MS);

  toastTimers.set(id, [enterTimer, durationTimer]);

  return id;
}

function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-[40px] left-1/2 z-[9999] flex -translate-x-1/2 flex-col-reverse items-center gap-[12px]">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          color={toast.color}
          message={toast.message}
          status={toast.status}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({
  color,
  message,
  onClose,
  status,
}: ToastProps & {
  status: ToastAnimationStatus;
  onClose: () => void;
}) {
  const { borderClassName, textClassName, iconBgClassName, Icon } =
    toastStyleMap[color];

  return (
    <div
      role="status"
      data-color={color}
      className={joinClassNames(
        "pointer-events-auto flex min-h-[51.2px] w-[640px] max-w-[calc(100vw-40px)] shrink-0 items-center overflow-hidden rounded-[10px] border bg-background-100 px-[16px] py-[9.6px] shadow-button",
        "transform transition-[opacity,transform] duration-200 ease-out will-change-transform",
        status === "visible"
          ? "translate-y-0 opacity-100"
          : "translate-y-[16px] opacity-0",
        borderClassName,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-[10px]">
        {iconBgClassName ? (
          <span
            className={joinClassNames(
              "flex size-[27.2px] shrink-0 items-center justify-center rounded-full",
              iconBgClassName,
            )}
          >
            <Icon
              aria-hidden="true"
              className="size-[25.5px] shrink-0 text-background-100"
            />
          </span>
        ) : (
          <Icon
            aria-hidden="true"
            className="size-[32px] shrink-0"
          />
        )}

        <p
          className={joinClassNames(
            "min-w-0 flex-1 break-words text-h3-category",
            textClassName,
          )}
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        aria-label="토스트 닫기"
        onClick={onClose}
        className="flex size-[28px] shrink-0 cursor-pointer items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
      >
        <ToastCloseIcon
          aria-hidden="true"
          className="size-[23.8px] shrink-0 text-background-500"
        />
      </button>
    </div>
  );
}

export default function Toast({ color, message }: ToastProps) {
  const toastIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const id = showToast(color, message);
    toastIds.current.add(id);
  }, [color, message]);

  useEffect(() => {
    const currentToastIds = toastIds.current;

    return () => {
      currentToastIds.forEach((id) => removeToast(id));
      currentToastIds.clear();
    };
  }, []);

  return null;
}
