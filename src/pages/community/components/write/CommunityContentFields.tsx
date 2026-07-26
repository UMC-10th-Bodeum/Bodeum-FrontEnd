const MAX_CONTENT_LENGTH = 2000;

type CommunityContentFieldsProps = {
  title: string;
  content: string;
  hashtags: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onHashtagsChange: (value: string) => void;
};

const inputClassName =
  "h-[48px] w-full rounded-[10px] border border-background-300 bg-background-200 px-[20px] py-[12px] text-h2-onboard text-background-600 outline-none placeholder:text-background-500 focus:border-main-400";

export default function CommunityContentFields({
  title,
  content,
  hashtags,
  onTitleChange,
  onContentChange,
  onHashtagsChange,
}: CommunityContentFieldsProps) {
  return (
    <>
      <fieldset className="mt-[11px]">
        <legend className="text-h3-onboard text-background-500">본문 작성</legend>
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          required
          maxLength={100}
          placeholder="제목을 입력해 주세요*"
          aria-label="게시글 제목"
          className={`mt-[12px] ${inputClassName}`}
        />
        <div className="relative mt-[12px]">
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            required
            maxLength={MAX_CONTENT_LENGTH}
            placeholder="내용을 입력해 주세요* (최대 2000자)"
            aria-label="게시글 내용"
            className="h-[158px] w-full resize-none rounded-[10px] border border-background-300 bg-background-200 px-[20px] py-[12px] text-h2-onboard text-background-600 outline-none placeholder:text-background-500 focus:border-main-400"
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

      <label
        htmlFor="community-hashtags"
        className="mt-[16px] block text-h3-onboard text-background-500"
      >
        해시태그
      </label>
      <input
        id="community-hashtags"
        value={hashtags}
        onChange={(event) => onHashtagsChange(event.target.value)}
        placeholder="해시태그를 입력해 주세요 (Ex. #발달인지, #5세 남아, #병원정보)"
        className={`mt-[12px] ${inputClassName}`}
      />
    </>
  );
}
