import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

import { infoDetailMockData } from "@/mocks/infoDetail";
import ButtonOutline from "@/components/ButtonOutline";
import InfoItem from "./components/InfoItem";
import RatingInput from "./ReviewWrite/RatingInput";
import ReviewTextArea from "./ReviewWrite/ReviewTextArea";
import ImageUploader from "./ReviewWrite/ImageUploader";
import ButtonFill from "@/components/ButtonFill";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import ReviewCancelModal from "./components/modal/ReviewCancelModal";

export default function WriteReviewPage() {
  const { category, id } = useParams();
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();

  const detail = infoDetailMockData.result;

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

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
        label: detail.name,
        onClick: () => navigate(`/info/${category}/${id}`),
      },
      {
        label: "후기 작성",
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category]);

  const handleSubmit = () => {
    console.log({
      rating,
      content,
      images,
    });

    // TODO
    // 후기 작성 API

    navigate(-1);
  };

  return (
    <div className="mx-auto flex max-w-[1240px] justify-center py-[20px]">
      <main className="w-[1240px] space-y-[20px]">
        <InfoItem
          mainCategory={detail.mainCategory}
          name={detail.name}
          address={detail.address}
          phone={detail.phone ?? undefined}
          subCategoryKo={detail.subCategoryKo}
          viewCount={detail.viewCount}
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
            disabled={!isValid}
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