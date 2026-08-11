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
      <div className="mt-[12px] flex h-[158px] flex-col rounded-[10px] border border-background-300 bg-background-200 transition-colors duration-150 focus-within:border-main-400 focus-within:bg-background-100">
        <div className="relative min-h-0 flex-1">
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value.slice(0, MAX_CONTENT_LENGTH))}
            required
            maxLength={MAX_CONTENT_LENGTH}
            placeholder="내용을 입력해 주세요* (최대 2000자)"
            aria-label="게시글 내용"
            className="h-full w-full resize-none bg-transparent px-[20px] pt-[12px] pb-[5px] text-h2-onboard text-background-600 outline-none placeholder:text-background-400"
          />
          {!content && (
            <p className="pointer-events-none absolute left-[20px] right-[20px] top-[40px] whitespace-normal break-words text-h2-onboard text-background-400">
              이웃 부모에게 상처를 주는 욕설, 비방, 광고 등 부적절한 내용은 무통보 삭제되며,
              누적 시 서비스 이용이 제한될 수 있습니다.
            </p>
          )}
        </div>
        <div className="shrink-0 px-[20px] pb-[12px] text-right">
          <span aria-live="polite" className="text-h2-onboard text-background-400">
            ({content.length}/{MAX_CONTENT_LENGTH})
          </span>
        </div>
      </div>
    </fieldset>
  );
}
