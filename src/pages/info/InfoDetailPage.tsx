import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import DetailHeader from "./components/Detail/DetailHeader";
import AIChatButton from "@/components/AIChatButton";
import BusinessHoursSection from "./components/Detail/BusinessHoursSection";
import LocationSection from "./components/Detail/LocationSection";
import ReviewSection from "./components/Detail/review/ReviewSection";
import SummaryCard from "./components/Detail/SummaryCard";
import IntroSection from "./components/Detail/IntroSection";
import { useInfoDetailQuery } from "@/hooks/queries/info/useInfoDetailQuery";
import { useInfoReviewListQuery } from "@/hooks/queries/info/useInfoReviewsQuery";

export default function InfoDetailPage() {
  const { category, id } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const navigate = useNavigate();
  const { data: detail, isPending, isError } = useInfoDetailQuery(Number(id));

  const { data: reviewData } = useInfoReviewListQuery(
    Number(id),
    0,
    10,
  );

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  useEffect(() => {
  if (!category || !detail) return;

    setBreadcrumb([
      {
        label: "정보",
        onClick: () => { },
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
    return <div>로딩중...</div>;
  }

  if (isError || !detail) {
    return <div>정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto flex max-w-[1240px] gap-6 px-8 py-5">
      <main className="w-[680px]  space-y-[10px]">
        <DetailHeader image={undefined} />
        <IntroSection
        // introduction={detail.introduction}
        // tags={detail.tags}
        />

        <BusinessHoursSection hours={detail.businessHours} />

        <LocationSection
          address={detail.address}
          homepageUrl={detail.homepageUrl ?? undefined}
        />

        <ReviewSection
          infoItemId={detail.infoItemId}
          reviews={reviewData?.reviews.content ?? []}
          totalReviewCount={reviewData?.totalElements ?? 0}
          averageRating={reviewData?.averageRating ?? 0}
          onWriteReview={() => navigate(`/info/${category}/${id}/review/write`)}
        />
      </main>

      <aside className="top-5 h-fit w-[400px] space-y-4">
        <SummaryCard
          name={detail.name}
          mainCategory={detail.mainCategory}
          subCategory={detail.subCategoryKo}
          homepageUrl={detail.homepageUrl ?? undefined}
          viewCount={detail.viewCount}
          scrapCount={detail.scrapCount}
          reviewCount={detail.reviewCount}
          isScrapped={detail.isScrapped}
          onScrap={() => { }}
          onShare={() => { }}
        />
        <AIChatButton />
      </aside>
    </div>
  );
}