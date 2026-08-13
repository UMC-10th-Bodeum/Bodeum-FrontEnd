import { useState, type FormEvent } from "react";

import ButtonFill from "@/components/ButtonFill";
import ButtonOutline from "@/components/ButtonOutline";
import { communityCategoryEntries, type CommunityCategory } from "@/constants/communityCategory";
import type {
  CommunityAuthorVisibility,
  CommunityPostFormInitialValues,
  CommunityPostFormValues,
} from "@/types/community";

import CommunityContentFields from "../CommunityContentFields";
import CommunityImageField from "./CommunityImageField";
import SelectableChipGroup from "./SelectableChipGroup";

type CommunityWriteFormProps = {
  onCancel: () => void;
  onSubmit: (payload: CommunityPostFormValues) => void;
  isSubmitting?: boolean;
  initialValues?: CommunityPostFormInitialValues;
  submitLabel?: string;
};

const categoryOptions = communityCategoryEntries.map(([value, label]) => ({
  value,
  label,
}));

const authorVisibilityOptions: Array<{
  value: CommunityAuthorVisibility;
  label: string;
}> = [
  { value: "PROFILE", label: "프로필 태그 공개" },
  { value: "ANONYMOUS", label: "완전 익명" },
];

export default function CommunityWriteForm({
  onCancel,
  onSubmit,
  isSubmitting = false,
  initialValues,
  submitLabel,
}: CommunityWriteFormProps) {
  const [category, setCategory] = useState<CommunityCategory | null>(
    initialValues?.category ?? null,
  );
  const [authorVisibility, setAuthorVisibility] = useState<CommunityAuthorVisibility | null>(
    initialValues?.authorVisibility ?? null,
  );
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialValues?.existingImageUrls ?? [],
  );

  const isSubmittable = category !== null && title.trim().length > 0 && content.trim().length > 0;

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable || category === null || isSubmitting) return;

    onSubmit({
      category,
      authorVisibility: authorVisibility ?? "PROFILE",
      title: title.trim(),
      content: content.trim(),
      images,
      existingImageUrls,
    });
  };

  return (
    <form onSubmit={submitPost} className="mx-auto w-[1240px]">
      <div className="rounded-[10px] border border-background-250 bg-background-100 pt-[20px] px-[20px] pb-[40px]">
        <p className="text-h1-onboard text-background-600">
          {initialValues ? "게시글 수정하기" : "게시글 작성하기"}
        </p>

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
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
        <CommunityImageField
          images={images}
          onChange={setImages}
          existingImageUrls={existingImageUrls}
          onRemoveExistingImage={(url) =>
            setExistingImageUrls((prev) => prev.filter((u) => u !== url))
          }
        />
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
          label={isSubmitting ? "처리 중..." : (submitLabel ?? "게시하기")}
          disabled={!isSubmittable || isSubmitting}
          className="!h-[44px] !w-[200px]"
        />
      </div>
    </form>
  );
}
