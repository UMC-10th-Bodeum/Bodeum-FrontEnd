import Input from "@/components/Input";

const MAX_CONTENT_LENGTH = 2000;

type CommunityContentFieldsProps = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function CommunityContentFields({
  title,
  content,
  onTitleChange,
  onContentChange,
}: CommunityContentFieldsProps) {
  return (
    <>
      <fieldset className="mt-[11px]">
        <legend className="text-h3-onboard text-background-500">본문 작성</legend>
        <label htmlFor="community-title" className="sr-only">
          게시글 제목
        </label>
        <Input
          id="community-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value.slice(0, 100))}
          placeholder="제목을 입력해 주세요*"
          className="mt-[12px] h-[48px] w-full"
        />
        <div className="relative mt-[12px]">
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            required
            maxLength={MAX_CONTENT_LENGTH}
            placeholder="내용을 입력해 주세요* (최대 2000자)"
            aria-label="게시글 내용"
            className="h-[158px] w-full resize-none rounded-[10px] border border-background-300 bg-background-200 px-[20px] py-[12px] text-h2-onboard text-background-600 outline-none transition-colors duration-150 placeholder:text-background-400 focus:border-main-400 focus:bg-background-100"
          />
          {!content && (
            <p className="pointer-events-none absolute left-[20px] right-[20px] top-[40px] whitespace-normal break-words text-h2-onboard text-background-400">
              이웃 부모에게 상처를 주는 욕설, 비방, 광고 등 부적절한 내용은 무통보 삭제되며, 누적 시
              서비스 이용이 제한될 수 있습니다.
            </p>
          )}
          <span
            aria-live="polite"
            className="pointer-events-none absolute bottom-[10px] right-[12px] text-h2-onboard text-background-400"
          >
            ({content.length}/{MAX_CONTENT_LENGTH})
          </span>
        </div>
      </fieldset>
    </>
  );
}
