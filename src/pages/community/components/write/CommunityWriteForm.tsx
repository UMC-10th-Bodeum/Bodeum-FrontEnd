import { useState, type FormEvent } from "react";

import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import { communityCategoryEntries, type CommunityCategory } from "@/constants/communityCategory";

import CommunityContentFields from "./CommunityContentFields";
import CommunityImageField from "./CommunityImageField";
import SelectableChipGroup from "./SelectableChipGroup";

type AuthorVisibility = "PROFILE" | "ANONYMOUS";

type CommunityWriteFormProps = {
  onCancel: () => void;
  onSubmit: () => void;
};

const categoryOptions = communityCategoryEntries.map(([value, label]) => ({
  value,
  label,
}));

const authorVisibilityOptions: Array<{
  value: AuthorVisibility;
  label: string;
}> = [
  { value: "PROFILE", label: "프로필 태그 공개" },
  { value: "ANONYMOUS", label: "완전 익명" },
];

export default function CommunityWriteForm({
  onCancel,
  onSubmit,
}: CommunityWriteFormProps) {
  const [category, setCategory] = useState<CommunityCategory | null>(null);
  const [authorVisibility, setAuthorVisibility] = useState<AuthorVisibility | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");

  const isSubmittable =
    category !== null &&
    authorVisibility !== null &&
    title.trim().length > 0 &&
    content.trim().length > 0;

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;
    onSubmit();
  };

  return (
    <form onSubmit={submitPost} className="mx-auto w-[1240px]">
      <div className="rounded-[10px] border border-background-250 bg-background-100 pt-[20px] px-[20px] pb-[40px]">
        <p className="text-h1-onboard text-background-600">게시글 작성하기</p>

        <SelectableChipGroup
          legend="게시판 유형"
          required
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          className="mt-[13px]"
        />
        <SelectableChipGroup
          legend="익명 설정"
          options={authorVisibilityOptions}
          value={authorVisibility}
          onChange={setAuthorVisibility}
          className="mt-[11px]"
        />
        <CommunityContentFields
          title={title}
          content={content}
          hashtags={hashtags}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onHashtagsChange={setHashtags}
        />
        <CommunityImageField />
      </div>

      <div className="mt-[13px] flex justify-center gap-[8px]">
        <ButtonOutline
          label="취소하기"
          tone="black"
          onClick={onCancel}
          className="!h-[44px] !w-[200px]"
        />
        <ButtonFill
          type="submit"
          label="게시하기"
          disabled={!isSubmittable}
          className="!h-[44px] !w-[200px]"
        />
      </div>
    </form>
  );
}
