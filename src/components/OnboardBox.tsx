import { useId } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';

import MainButton from './MainButton';

type OnboardBoxProps = {
  title: ReactNode;
  description: ReactNode;
  leftButtonText: ReactNode;
  rightButtonText: ReactNode;
  onLeftButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick?: MouseEventHandler<HTMLButtonElement>;
  modal?: boolean;
  className?: string;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

type OnboardBoxButtonProps = {
  children: ReactNode;
  color: 'gray' | 'red';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const onboardBoxButtonClasses: Record<OnboardBoxButtonProps['color'], string> = {
  gray:
    '!w-full !bg-background-250 !text-background-500 hover:!bg-background-250 active:!bg-background-250 active:!text-background-500',
  red:
    '!w-full !bg-sub-red !text-background-100 hover:!bg-sub-red active:!bg-sub-red active:!text-background-100',
};

function OnboardBoxButton({ children, color, onClick }: OnboardBoxButtonProps) {
  return (
    <MainButton
      size="M"
      className={onboardBoxButtonClasses[color]}
      onClick={onClick}
    >
      {children}
    </MainButton>
  );
}

export default function OnboardBox({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  modal = false,
  className,
}: OnboardBoxProps) {
  const titleId = useId();

  const onboardBox = (
    <section
      role={modal ? 'dialog' : undefined}
      aria-modal={modal || undefined}
      aria-labelledby={modal ? titleId : undefined}
      className={joinClassNames(
        'flex h-[307px] w-[581px] max-w-[calc(100vw-40px)] flex-col items-start gap-[44px] overflow-hidden rounded-[20px] bg-background-100 px-[40px] py-[44px]',
        className,
      )}
    >
      <div className="flex h-[125px] w-full max-w-[500px] min-w-0 shrink-0 flex-col items-start gap-[20px] overflow-hidden">
        <h2
          id={titleId}
          className="relative h-[33px] w-full text-h1-onboard text-background-600"
        >
          <span className="absolute left-0 top-0 block w-full overflow-hidden text-ellipsis whitespace-nowrap pb-[2px]">
            {title}
          </span>
        </h2>
        <div className="line-clamp-3 h-[72px] w-full whitespace-pre-line break-words text-h2-onboard text-background-500">
          {description}
        </div>
      </div>

      <div className="flex h-[50px] w-full shrink-0 items-start gap-[16px]">
        <div className="min-w-0 flex-1">
          <OnboardBoxButton color="gray" onClick={onLeftButtonClick}>
            {leftButtonText}
          </OnboardBoxButton>
        </div>
        <div className="min-w-0 flex-1">
          <OnboardBoxButton color="red" onClick={onRightButtonClick}>
            {rightButtonText}
          </OnboardBoxButton>
        </div>
      </div>
    </section>
  );

  if (modal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-600/50 px-[20px]">
        {onboardBox}
      </div>
    );
  }

  return onboardBox;
}
