import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type MainButtonSize = 'L' | 'M' | 'S';

type MainButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> & {
  children?: ReactNode;
  size?: MainButtonSize;
  disabled?: boolean;
};

const sizeClasses: Record<MainButtonSize, string> = {
  L: 'h-[50px] w-[536px] rounded-[10px] text-[16px] font-normal leading-[1.5]',
  M: 'h-[50px] w-[260px] rounded-[10px] text-[16px] font-normal leading-[1.5]',
  S: 'h-[25px] w-[66px] rounded-[5px] text-[11px] font-medium leading-[1.5]',
};

const enabledClasses = 'bg-[#0C72E0] text-white hover:bg-[#91C3F9] active:bg-[#063F7B]';
const disabledClass = 'bg-[#D7DBE4] text-[#616368]';
const smallDisabledClass = 'bg-[#C1C6D1] text-[#616368]';

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

export default function MainButton({
  children = '다음',
  size = 'M',
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}: MainButtonProps) {
  const disabledVisualClass = size === 'S' ? smallDisabledClass : disabledClass;

  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-state={disabled ? 'disabled' : '기본'}
      className={joinClassNames(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap border-0 px-0 py-0 text-center',
        '[font-family:\'Noto_Sans_KR\',sans-serif] transition-colors duration-150 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C72E0]',
        sizeClasses[size],
        disabled ? disabledVisualClass : enabledClasses,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
