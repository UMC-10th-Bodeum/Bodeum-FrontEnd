import type { MouseEventHandler, ReactNode } from 'react';

import MainButton from './MainButton';

export type OnboardBoxFrameButtonColor =
  | 'main-500'
  | 'main-400'
  | 'main-300'
  | 'main-200'
  | 'main-150'
  | 'main-100'
  | 'sub-yellow'
  | 'sub-yellow-2'
  | 'sub-red'
  | 'sub-red-2'
  | 'sub-green'
  | 'sub-green-2'
  | 'sub-purple'
  | 'sub-purple-2'
  | 'background-600'
  | 'background-500'
  | 'background-400'
  | 'background-300'
  | 'background-250'
  | 'background-200'
  | 'background-100';

type OnboardBoxFrameBaseProps = {
  children: ReactNode;
  rightButtonText: ReactNode;
  rightButtonColor?: OnboardBoxFrameButtonColor;
  showClose?: boolean;
  className?: string;
  ariaLabelledby?: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick?: MouseEventHandler<HTMLButtonElement>;
};

type OneButtonProps = OnboardBoxFrameBaseProps & {
  buttonCount: 1;
  leftButtonText?: never;
  onLeftButtonClick?: never;
};

type TwoButtonProps = OnboardBoxFrameBaseProps & {
  buttonCount: 2;
  leftButtonText: ReactNode;
  onLeftButtonClick?: MouseEventHandler<HTMLButtonElement>;
};

export type OnboardBoxFrameProps = OneButtonProps | TwoButtonProps;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

const leftButtonClassName =
  '!w-full !bg-background-250 !text-background-500 hover:!bg-background-250 active:!bg-background-250 active:!text-background-500';

const rightButtonColorClassNames: Record<OnboardBoxFrameButtonColor, string> = {
  'main-500':
    '!bg-main-500 !text-background-100 hover:!bg-main-500 active:!bg-main-500 active:!text-background-100',
  'main-400':
    '!bg-main-400 !text-background-100 hover:!bg-main-400 active:!bg-main-400 active:!text-background-100',
  'main-300':
    '!bg-main-300 !text-background-600 hover:!bg-main-300 active:!bg-main-300 active:!text-background-600',
  'main-200':
    '!bg-main-200 !text-background-600 hover:!bg-main-200 active:!bg-main-200 active:!text-background-600',
  'main-150':
    '!bg-main-150 !text-background-600 hover:!bg-main-150 active:!bg-main-150 active:!text-background-600',
  'main-100':
    '!bg-main-100 !text-background-600 hover:!bg-main-100 active:!bg-main-100 active:!text-background-600',
  'sub-yellow':
    '!bg-sub-yellow !text-background-600 hover:!bg-sub-yellow active:!bg-sub-yellow active:!text-background-600',
  'sub-yellow-2':
    '!bg-sub-yellow-2 !text-background-600 hover:!bg-sub-yellow-2 active:!bg-sub-yellow-2 active:!text-background-600',
  'sub-red':
    '!bg-sub-red !text-background-100 hover:!bg-sub-red active:!bg-sub-red active:!text-background-100',
  'sub-red-2':
    '!bg-sub-red-2 !text-background-600 hover:!bg-sub-red-2 active:!bg-sub-red-2 active:!text-background-600',
  'sub-green':
    '!bg-sub-green !text-background-100 hover:!bg-sub-green active:!bg-sub-green active:!text-background-100',
  'sub-green-2':
    '!bg-sub-green-2 !text-background-600 hover:!bg-sub-green-2 active:!bg-sub-green-2 active:!text-background-600',
  'sub-purple':
    '!bg-sub-purple !text-background-100 hover:!bg-sub-purple active:!bg-sub-purple active:!text-background-100',
  'sub-purple-2':
    '!bg-sub-purple-2 !text-background-600 hover:!bg-sub-purple-2 active:!bg-sub-purple-2 active:!text-background-600',
  'background-600':
    '!bg-background-600 !text-background-100 hover:!bg-background-600 active:!bg-background-600 active:!text-background-100',
  'background-500':
    '!bg-background-500 !text-background-100 hover:!bg-background-500 active:!bg-background-500 active:!text-background-100',
  'background-400':
    '!bg-background-400 !text-background-100 hover:!bg-background-400 active:!bg-background-400 active:!text-background-100',
  'background-300':
    '!bg-background-300 !text-background-600 hover:!bg-background-300 active:!bg-background-300 active:!text-background-600',
  'background-250':
    '!bg-background-250 !text-background-500 hover:!bg-background-250 active:!bg-background-250 active:!text-background-500',
  'background-200':
    '!bg-background-200 !text-background-600 hover:!bg-background-200 active:!bg-background-200 active:!text-background-600',
  'background-100':
    '!bg-background-100 !text-background-600 hover:!bg-background-100 active:!bg-background-100 active:!text-background-600',
};

function CloseButton({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      aria-label="닫기"
      onClick={onClick}
      className="absolute right-[20px] top-[20px] flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
    >
      <span className="absolute h-[2px] w-[17px] rotate-45 rounded-full bg-background-600" />
      <span className="absolute h-[2px] w-[17px] -rotate-45 rounded-full bg-background-600" />
    </button>
  );
}

export default function OnboardBoxFrame(props: OnboardBoxFrameProps) {
  const rightButtonColor = props.rightButtonColor ?? 'main-400';

  const onboardBox = (
    <section
      role="dialog"
      aria-modal
      aria-labelledby={props.ariaLabelledby}
      className={joinClassNames(
        'relative flex w-[581px] max-w-[calc(100vw-40px)] flex-col items-start gap-[44px] rounded-[20px] bg-background-100 px-[40px] py-[44px]',
        'z-50',
        props.className,
      )}
    >
      {props.showClose && <CloseButton onClick={props.onClose} />}

      {props.children}

      <div className="flex w-full shrink-0 items-start gap-[16px]">
        {props.buttonCount === 2 && (
          <div className="min-w-0 flex-1">
            <MainButton
              size="M"
              className={leftButtonClassName}
              onClick={props.onLeftButtonClick}
            >
              {props.leftButtonText}
            </MainButton>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <MainButton
            size={props.buttonCount === 1 ? 'L' : 'M'}
            className={joinClassNames(
              '!w-full',
              rightButtonColorClassNames[rightButtonColor],
            )}
            onClick={props.onRightButtonClick}
          >
            {props.rightButtonText}
          </MainButton>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background-600/50" />
      {onboardBox}
    </>
  );
}
