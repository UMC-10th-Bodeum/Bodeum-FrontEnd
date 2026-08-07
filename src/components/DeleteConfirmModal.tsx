import { useEffect, useRef } from "react";

import OnboardCancelBox from "@/components/OnboardCancelBox";

const focusableElementSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "삭제하기",
  loading = false,
}: DeleteConfirmModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getDialog = () =>
      containerRef.current?.querySelector<HTMLElement>('[role="dialog"]') ?? null;
    const getFocusableElements = () =>
      Array.from(
        getDialog()?.querySelectorAll<HTMLElement>(focusableElementSelector) ?? [],
      );

    const focusFrame = window.requestAnimationFrame(() => {
      getFocusableElements()[0]?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = getDialog();
      const focusableElements = getFocusableElements();
      if (!dialog || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]"
    >
      <OnboardCancelBox
        title={title}
        description={description}
        leftButtonText={cancelText}
        rightButtonText={confirmText}
        className="z-[70]!"
        rightButtonColor="sub-red"
        onLeftButtonClick={onCancel}
        onRightButtonClick={onConfirm}
        leftButtonDisabled={false}
        rightButtonDisabled={loading}
      />
    </div>
  );
}
