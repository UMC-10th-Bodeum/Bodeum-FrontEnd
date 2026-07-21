import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type TextareaHTMLAttributes,
  type WheelEvent,
} from "react";

export type AiInputVariant = "default" | "input" | "typing" | "variant4";

type AiInputProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
> & {
  value: string;
  variant?: AiInputVariant;
  onValueChange: (value: string) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onSubmit?: () => void;
};

export default function AiInput({
  value,
  variant = "default",
  onValueChange,
  onExpandedChange,
  onSubmit,
  className,
  placeholder = "궁금한 정보를 입력해 주세요...",
  ...textareaProps
}: AiInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollbarTrackRef = useRef<HTMLSpanElement>(null);
  const draggingPointerRef = useRef<number | null>(null);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const syncScrollThumb = useCallback(
    (textarea = textareaRef.current) => {
      if (!textarea) return;

      const maxScrollTop = Math.max(
        0,
        textarea.scrollHeight - textarea.clientHeight,
      );
      const trackHeight = scrollbarTrackRef.current?.clientHeight ?? 42;
      const maxThumbOffset = Math.max(0, trackHeight - 10);
      const scrollProgress =
        maxScrollTop === 0 ? 0 : textarea.scrollTop / maxScrollTop;

      setThumbOffset(scrollProgress * maxThumbOffset);
    },
    [],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "21px";
    const scrollHeight = textarea.scrollHeight;
    const nextExpanded = scrollHeight > 21;

    textarea.style.height = `${Math.min(scrollHeight, 42)}px`;
    setIsExpanded(nextExpanded);
    setIsOverflowing(scrollHeight > 42);
    onExpandedChange?.(nextExpanded);
    syncScrollThumb(textarea);
  }, [onExpandedChange, syncScrollThumb, value, variant]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
    }
  };

  const scrollFromPointer = (clientY: number) => {
    const textarea = textareaRef.current;
    const track = scrollbarTrackRef.current;
    if (!textarea || !track) return;

    const trackRect = track.getBoundingClientRect();
    const maxThumbOffset = Math.max(0, trackRect.height - 10);
    const nextThumbOffset = Math.min(
      maxThumbOffset,
      Math.max(0, clientY - trackRect.top - 5),
    );
    const maxScrollTop = Math.max(
      0,
      textarea.scrollHeight - textarea.clientHeight,
    );
    const scrollProgress =
      maxThumbOffset === 0 ? 0 : nextThumbOffset / maxThumbOffset;

    textarea.scrollTop = scrollProgress * maxScrollTop;
    syncScrollThumb(textarea);
  };

  const handleScrollbarPointerDown = (
    event: ReactPointerEvent<HTMLSpanElement>,
  ) => {
    draggingPointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollFromPointer(event.clientY);
  };

  const handleScrollbarPointerMove = (
    event: ReactPointerEvent<HTMLSpanElement>,
  ) => {
    if (draggingPointerRef.current !== event.pointerId) return;
    scrollFromPointer(event.clientY);
  };

  const handleScrollbarPointerUp = (
    event: ReactPointerEvent<HTMLSpanElement>,
  ) => {
    if (draggingPointerRef.current !== event.pointerId) return;
    draggingPointerRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleScrollbarWheel = (event: WheelEvent<HTMLSpanElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    event.preventDefault();
    textarea.scrollTop += event.deltaY;
    syncScrollThumb(textarea);
  };

  return (
    <div
      data-variant={variant}
      className={`flex w-full items-center gap-[10px] overflow-hidden rounded-[10px] border px-[18px] py-[10px] ${
        isExpanded ? "h-[64px]" : "h-[44px]"
      } ${
        variant === "typing" || variant === "variant4"
          ? "border-main-400 bg-background-100"
          : "border-transparent bg-main-100"
      } ${className ?? ""}`}
    >
      <textarea
        {...textareaProps}
        ref={textareaRef}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={(event) => syncScrollThumb(event.currentTarget)}
        className="no-scrollbar max-h-[42px] min-h-[21px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-h4-list text-background-600 outline-none placeholder:text-background-500"
      />

      {isOverflowing && (
        <span
          ref={scrollbarTrackRef}
          aria-hidden="true"
          onPointerDown={handleScrollbarPointerDown}
          onPointerMove={handleScrollbarPointerMove}
          onPointerUp={handleScrollbarPointerUp}
          onPointerCancel={handleScrollbarPointerUp}
          onWheel={handleScrollbarWheel}
          className="relative w-[8px] self-stretch shrink-0 touch-none overflow-hidden rounded-[12px] bg-background-250"
        >
          <span
            className="absolute left-0 top-0 h-[10px] w-[8px] rounded-[12px] bg-background-300 transition-transform duration-75"
            style={{ transform: `translateY(${thumbOffset}px)` }}
          />
        </span>
      )}
    </div>
  );
}
