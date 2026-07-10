import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type MainButtonSize = 'L' | 'M' | 'S';

type MainButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> & {
  children: ReactNode;
  disabled?: boolean;
};

type MainButtonProps = MainButtonBaseProps &
  (
    | {
        size: Exclude<MainButtonSize, 'S'>;
        stroke?: never;
      }
    | {
        size: 'S';
        stroke?: boolean;
      }
  );

const sizeClasses: Record<MainButtonSize, string> = {
  L: 'h-[50px] w-[536px] rounded-[10px] text-h2-onboard',
  M: 'h-[50px] w-[260px] rounded-[10px] text-h2-onboard',
  S: 'h-[25px] w-[66px] rounded-[5px] text-body-label',
};

const filledEnabledClasses =
  'bg-main-400 text-background-100 hover:bg-main-400 hover:shadow-[1px_2px_15px_rgba(0,0,0,0.15)] active:bg-main-500 active:shadow-none';
const filledDisabledClasses: Record<MainButtonSize, string> = {
  L: 'bg-background-250 text-background-500',
  M: 'bg-background-250 text-background-500',
  S: 'bg-background-300 text-background-500',
};
const strokeEnabledClasses =
  'border-main-400 bg-transparent text-main-400 hover:border-main-500 hover:text-main-500 active:border-main-400 active:bg-main-400 active:text-background-100';
const strokeDisabledClasses =
  'border-background-500 bg-transparent text-background-500';

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

export default function MainButton({
  children,
  size,
  stroke = false,
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}: MainButtonProps) {
  const isStroke = size === 'S' && stroke;

  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-state={disabled ? 'disabled' : '기본'}
      className={joinClassNames(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap px-0 py-0 text-center',
        'transition-[background-color,color,border-color,box-shadow] duration-150 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400',
        sizeClasses[size],
        isStroke ? 'border' : 'border-0',
        isStroke
          ? disabled
            ? strokeDisabledClasses
            : strokeEnabledClasses
          : disabled
            ? filledDisabledClasses[size]
            : filledEnabledClasses,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
