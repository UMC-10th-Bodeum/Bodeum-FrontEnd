import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { calculateResponsiveScale } from "../responsiveOnboarding";

type ResponsiveOnboardingStageProps = {
  children: ReactNode;
};

function getNumericStyleValue(value: string) {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export default function ResponsiveOnboardingStage({
  children,
}: ResponsiveOnboardingStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const viewport = stage?.parentElement;

    if (!stage || !viewport) {
      return;
    }

    const updateScale = () => {
      const viewportStyle = window.getComputedStyle(viewport);
      const availableWidth =
        viewport.clientWidth -
        getNumericStyleValue(viewportStyle.paddingLeft) -
        getNumericStyleValue(viewportStyle.paddingRight);
      const availableHeight =
        viewport.clientHeight -
        getNumericStyleValue(viewportStyle.paddingTop) -
        getNumericStyleValue(viewportStyle.paddingBottom);
      const nextScale = calculateResponsiveScale({
        availableWidth,
        availableHeight,
        contentWidth: stage.offsetWidth,
        contentHeight: stage.offsetHeight,
      });

      setScale((currentScale) =>
        Math.abs(currentScale - nextScale) < 0.001
          ? currentScale
          : nextScale,
      );
    };

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(stage);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", updateScale);
    updateScale();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="flex shrink-0 origin-center items-center justify-center"
      style={{ transform: `scale(${scale})` }}
    >
      {children}
    </div>
  );
}
