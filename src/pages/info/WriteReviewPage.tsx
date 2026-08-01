import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

import ButtonOutline from "@/components/ButtonOutline";
import InfoItem from "./components/InfoItem";
import RatingInput from "./ReviewWrite/RatingInput";
import ReviewTextArea from "./ReviewWrite/ReviewTextArea";
import ImageUploader from "@/components/ImageUploader";
import ButtonFill from "@/components/ButtonFill";
import ReviewCancelModal from "./components/modal/ReviewCancelModal";
import { useInfoDetailQuery } from "@/hooks/queries/info/useInfoDetailQuery";
import { useCreateInfoReviewMutation } from "@/hooks/queries/info/useCreateInfoReviewMutation";

export default function WriteReviewPage() {
  const { category, id } = useParams();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { mutate } = useCreateInfoReviewMutation();

  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const { data: detail, isPending, isError } = useInfoDetailQuery(Number(id));

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  if (isPending) {
    return <div>로딩중...</div>;
  }

  if (isError || !detail) {
    return <div>정보를 불러올 수 없습니다.</div>;
  }

  const isValid = rating > 0 && content.trim().length > 0;

  useEffect(() => {
    if (!category) return;

    setBreadcrumb([
      {
        label: "정보",
      },
      {
        label: infoCategory?.label ?? "",
        onClick: () => navigate(`/info?category=${category}`),
      },
      {
        label: detail!.name,
        onClick: () => navigate(`/info/${category}/${id}`),
      },
      {
        label: "후기 작성",
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category]);

  const handleSubmit = () => {
    if (!id) return;

    mutate(
      {
        infoItemId: Number(id),
        body: {
          rating,
          content,
          imageUrls: [], // 이미지 업로드 API 붙으면 URL 넣기
        },
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="mx-auto flex max-w-[1240px] justify-center py-[20px]">
      <main className="w-[1240px] space-y-[20px]">
        <InfoItem
          mainCategory={detail?.mainCategory}
          name={detail?.name}
          address={detail?.address}
          phone={detail?.phone ?? undefined}
          subCategoryKo={detail?.subCategoryKo}
          viewCount={detail?.viewCount}
          scrapCount={detail.scrapCount}
          isScrapped={detail.isScrapped}
          clickable={false}
        />

        <section className="rounded-[10px] border border-background-250 bg-background-100 p-[20px]">
          <h2 className="mb-[16px] text-h1-onboard text-background-600">
            후기 작성하기
          </h2>

          <RatingInput
            value={rating}
            onChange={setRating}
          />

          <ReviewTextArea
            value={content}
            onChange={setContent}
          />

          <ImageUploader
            images={images}
            onChange={setImages}
          />
        </section>

        <div className="flex justify-center gap-2">
          <ButtonOutline
            label="취소하기"
            tone="black"
            className="w-[200px]"
            onClick={() => setIsCancelOpen(true)}
          />

          <ButtonFill
            label="게시하기"
            disabled={!isValid || isPending}
            className="w-[200px]"
            onClick={handleSubmit}
          />
        </div>
      </main>

      <ReviewCancelModal
        open={isCancelOpen}
        onContinue={() => setIsCancelOpen(false)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
