import { useRef, useState } from "react";

export function useDragScroll() {
  const [isDragging, setIsDragging] = useState(false);

  const isDown = useRef(false);
  const dragged = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    const element = e.currentTarget;

    isDown.current = true;
    dragged.current = false;

    startX.current = e.clientX;
    startScrollLeft.current = element.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current) return;

    const element = e.currentTarget;
    const diff = e.clientX - startX.current;

    if (!dragged.current && Math.abs(diff) < 5) {
      return;
    }

    dragged.current = true;
    setIsDragging(true);

    e.preventDefault();

    element.scrollLeft = startScrollLeft.current - diff;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (!isDown.current) return;

    isDown.current = false;
    setIsDragging(false);
  };

  const handleClickCapture = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!dragged.current) return;

    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClickCapture,
  };
}