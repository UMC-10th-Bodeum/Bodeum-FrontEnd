import { useEffect, useState } from "react";
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
import { showToast } from "@/components/Toast";
import { toggleInfoScrap } from "@/apis/info";

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

  const [isScrapped, setIsScrapped] = useState<boolean>(detail?.isScrapped ?? false);
  const [scrapCount, setScrapCount] = useState<number>(detail?.scrapCount ?? 0);

  useEffect(() => {
    setIsScrapped(detail?.isScrapped ?? false);
    setScrapCount(detail?.scrapCount ?? 0);
  }, [detail]);

  const handleScrap = async () => {
    try {
      const result = await toggleInfoScrap(Number(id));

      setIsScrapped(result.isScrapped);
      setScrapCount(result.scrapCount);
    } catch {
      showToast("red", "스크랩에 실패했습니다.");
    }
  };
  
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
          tags={detail.tags}
        />

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

      <aside className="top-5 h-fit w-[400px] space-y-4">
        <SummaryCard
          name={detail.name}
          mainCategory={detail.mainCategory}
          subCategory={detail.subCategoryKo}
          homepageUrl={detail.homepageUrl ?? undefined}
          viewCount={detail.viewCount}
          scrapCount={scrapCount}
          reviewCount={detail.reviewCount}
          isScrapped={isScrapped}
          address={detail.address}
          sido={detail.sido}
          sigungu={detail.sigungu}
          phone={detail.phone}
          onScrap={handleScrap}
          onShare={() => { }}
        />
        <AIChatButton />
      </aside>
    </div>
  );
}