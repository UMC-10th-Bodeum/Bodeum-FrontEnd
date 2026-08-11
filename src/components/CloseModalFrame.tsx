import type { MouseEventHandler, ReactNode } from "react";
import CloseIcon from "@/assets/icons/Close.svg?react";
import MainButton from "@/components/MainButton";

interface CloseModalFrameProps {
  children: ReactNode;
  leftButtonText: ReactNode;
  rightButtonText: ReactNode;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onLeftButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick?: MouseEventHandler<HTMLButtonElement>;
  rightButtonDisabled?: boolean;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  showFooter?: boolean;
}

export default function CloseModalFrame({
  children,
  leftButtonText,
  rightButtonText,
  onClose,
  onLeftButtonClick,
  onRightButtonClick,
  rightButtonDisabled,
  className,
  overlayClassName,
  showCloseButton = true,
  showFooter = true,
}: CloseModalFrameProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${overlayClassName ?? ""}`}
    >
      <div
        className={`relative flex w-[624px] flex-col rounded-[20px] bg-background-100 px-[44px] py-[44px] ${className ?? ""}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-[20px] right-[20px] z-10 cursor-pointer"
          >
            <CloseIcon />
          </button>
        )}

        <div className="mt-2 flex-1">{children}</div>

        {showFooter && (
          <div className="mt-[40px] flex gap-[16px]">
            <MainButton
              size="L"
              className="flex-1 !bg-background-250 !text-background-500 hover:!bg-background-250 active:!bg-background-250"
              onClick={onLeftButtonClick}
            >
              {leftButtonText}
            </MainButton>

            <MainButton
              size="L"
              className="flex-1"
              disabled={rightButtonDisabled}
              onClick={onRightButtonClick}
            >
              {rightButtonText}
            </MainButton>
          </div>
        )}
      </div>
    </div>
  );
}
