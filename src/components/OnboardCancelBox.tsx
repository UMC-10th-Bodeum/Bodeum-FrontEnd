import { useId } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';

import OnboardBoxFrame from './OnboardBoxFrame';
import type { OnboardBoxFrameButtonColor } from './OnboardBoxFrame';

type OnboardCancelBoxProps = {
  title: ReactNode;
  description: ReactNode;
  leftButtonText: ReactNode;
  rightButtonText: ReactNode;
  onLeftButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  rightButtonColor?: OnboardBoxFrameButtonColor;
};

export default function OnboardCancelBox({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  className,
  rightButtonColor = 'main-400',
}: OnboardCancelBoxProps) {
  const titleId = useId();

  return (
    <OnboardBoxFrame
      buttonCount={2}
      leftButtonText={leftButtonText}
      rightButtonText={rightButtonText}
      rightButtonColor={rightButtonColor}
      className={className}
      ariaLabelledby={titleId}
      onLeftButtonClick={onLeftButtonClick}
      onRightButtonClick={onRightButtonClick}
    >
      <div className="flex w-full max-w-[500px] min-w-0 shrink-0 flex-col items-start gap-[20px]">
        <h2
          id={titleId}
          className="w-full break-words text-h1-onboard text-background-600"
        >
          {title}
        </h2>
        <div className="w-full whitespace-pre-line break-words text-h2-onboard text-background-500">
          {description}
        </div>
      </div>
    </OnboardBoxFrame>
  );
}
