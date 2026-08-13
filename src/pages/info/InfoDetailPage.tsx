import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import AIChatButton from "@/components/button/AIChatButton";
import BusinessHoursSection from "./components/Detail/BusinessHoursSection";
import LocationSection from "./components/Detail/LocationSection";
import ReviewSection from "./components/Detail/review/ReviewSection";
import SummaryCard from "./components/Detail/SummaryCard";
import IntroSection from "./components/Detail/IntroSection";
import { useInfoDetail } from "@/hooks/useInfoDetail";
import { useInfoReviewList } from "@/hooks/useInfoReviewList";
import AsyncState from "@/components/AsyncState";
import CategoryModal from "./components/modal/CategoryModal";

export default function InfoDetailPage() {
  const { category, id } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const { data: detail, isPending, isError } = useInfoDetail(Number(id));

  const { data: reviewData } = useInfoReviewList(
    Number(id),
    0,
    100,
  );

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  useEffect(() => {
    if (!category || !detail) return;

    setBreadcrumb([
      {
        label: "정보",
        onClick: () => setCategoryOpen(true),
      },
      {
        label: infoCategory?.label ?? "",
        onClick: () => navigate(`/info?category=${category}`),
      },
      {
        label: detail!.name,
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category, detail?.name, infoCategory, navigate, setBreadcrumb]);
  
  if (isPending) {
    return <AsyncState type="loading" />;
  }

  if (isError || !detail) {
    return <AsyncState type="error" />;
  }

  return (
    <div className="flex justify-center gap-6 px-8 py-5">
      <main className="w-[680px] space-y-[10px]">
        <SummaryCard
          infoItemId={detail.infoItemId}
          name={detail.name}
          mainCategory={detail.mainCategory}
          subCategory={detail.subCategoryKo}
          homepageUrl={detail.homepageUrl ?? undefined}
          viewCount={detail.viewCount}
          scrapCount={detail.scrapCount}
          reviewCount={detail.reviewCount}
          isScrapped={detail.isScrapped}
          address={detail.address}
          sido={detail.sido}
          sigungu={detail.sigungu}
          phone={detail.phone}
        />
        <IntroSection
          introduction={detail.introduction}
          tags={detail.tags}
        />
        <AIChatButton />
        <BusinessHoursSection hours={detail.businessHours} />

        <LocationSection
          infoItemId={detail.infoItemId}
          address={detail.address}
        />

        <ReviewSection
          infoItemId={detail.infoItemId}
          reviews={reviewData?.reviews.content ?? []}
          totalReviewCount={reviewData?.totalElements ?? 0}
          averageRating={reviewData?.averageRating ?? 0}
          onWriteReview={() => navigate(`/info/${category}/${id}/review/write`)}
        />
      </main>
      {categoryOpen && (
        <CategoryModal
          category={category as ParentCategory}
          onClose={() => setCategoryOpen(false)}
          onSelect={(selectedCategory) => {
            navigate(`/info?category=${selectedCategory}`);
            setCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
}