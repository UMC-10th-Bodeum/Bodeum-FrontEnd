import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type MainButtonSize = 'L' | 'M' | 'S';

type MainButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> & {
  children: ReactNode;
  size: MainButtonSize;
  disabled?: boolean;
};

const sizeClasses: Record<MainButtonSize, string> = {
  L: 'h-[50px] w-[536px] rounded-[10px] text-h2-onboard',
  M: 'h-[50px] w-[260px] rounded-[10px] text-h2-onboard',
  S: 'h-[25px] w-[66px] rounded-[5px] text-body-label',
};

const enabledClasses =
  'bg-main-400 text-background-100 hover:bg-main-300 active:bg-main-500';
const disabledClasses: Record<MainButtonSize, string> = {
  L: 'bg-background-250 text-background-500',
  M: 'bg-background-250 text-background-500',
  S: 'bg-background-300 text-background-500',
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

export default function MainButton({
  children,
  size,
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}: MainButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-state={disabled ? 'disabled' : '기본'}
      className={joinClassNames(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap border-0 px-0 py-0 text-center',
        'transition-colors duration-150 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400',
        sizeClasses[size],
        disabled ? disabledClasses[size] : enabledClasses,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
