import Input from "@/components/Input";

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;

type CommunityContentFieldsProps = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  showLegend?: boolean;
};

type CommunityTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder: string;
  placeholderClassName?: string;
  ariaLabel: string;
  showGuideline?: boolean;
  compact?: boolean;
  onEnter?: () => void;
};

export function CommunityTextarea({
  value,
  onChange,
  maxLength,
  placeholder,
  placeholderClassName = "",
  ariaLabel,
  showGuideline = false,
  compact = false,
  onEnter,
}: CommunityTextareaProps) {
  return (
    <div
      className={`flex w-full max-w-full min-w-0 flex-col rounded-[10px] border border-background-300 bg-background-200 transition-colors duration-150 focus-within:border-main-400 focus-within:bg-background-100 ${
        compact ? "h-[96px]" : "h-[158px]"
      }`}
    >
      <div className="relative min-h-0 flex-1">
        <textarea
          value={value}
          onChange={(event) =>
            onChange(
              maxLength === undefined
                ? event.target.value
                : event.target.value.slice(0, maxLength),
            )
          }
          onKeyDown={(event) => {
            if (!onEnter || event.nativeEvent.isComposing) return;

            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onEnter();
            }
          }}
          required
          maxLength={maxLength}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={`h-full w-full resize-none bg-transparent px-[20px] pt-[12px] pb-[5px] text-h2-onboard text-background-600 outline-none placeholder:text-background-400 ${placeholderClassName}`}
        />
        {showGuideline && !value && (
          <p className="pointer-events-none absolute left-[20px] right-[20px] top-[40px] whitespace-normal break-words text-h2-onboard text-background-400">
            이웃 부모에게 상처를 주는 욕설, 비방, 광고 등 부적절한 내용은 무통보 삭제되며,
            누적 시 서비스 이용이 제한될 수 있습니다.
          </p>
        )}
      </div>
      {maxLength !== undefined && (
        <div className="shrink-0 px-[20px] pb-[12px] text-right">
          <span aria-live="polite" className="text-h2-onboard text-background-400">
            ({value.length}/{maxLength})
          </span>
        </div>
      )}
    </div>
  );
}

export default function CommunityContentFields({
  title,
  content,
  onTitleChange,
  onContentChange,
  showLegend = true,
}: CommunityContentFieldsProps) {
  return (
    <fieldset className={showLegend ? "mt-[11px]" : ""}>
      {showLegend && (
        <legend className="text-h3-onboard text-background-500">본문 작성</legend>
      )}
      <label htmlFor="community-title" className="sr-only">
        게시글 제목
      </label>
      <div className={showLegend ? "relative mt-[12px]" : "relative"}>
        <Input
          id="community-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value.slice(0, MAX_TITLE_LENGTH))}
          placeholder="제목을 입력해 주세요*"
          className="h-[48px] w-full [&>div]:!border [&>div]:!border-background-300 [&>div:focus-within]:!border-main-400 [&_input]:pr-[72px]"
        />
        <span
          aria-live="polite"
          className="pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2 text-h2-onboard text-background-400"
        >
          ({title.length}/{MAX_TITLE_LENGTH})
        </span>
      </div>
      <div className="mt-[12px]">
        <CommunityTextarea
          value={content}
          onChange={onContentChange}
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="내용을 입력해 주세요* (최대 2000자)"
          ariaLabel="게시글 내용"
          showGuideline
        />
      </div>
    </fieldset>
  );
}
