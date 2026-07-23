import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import { infoDetailMockData, infoReviewMockData } from "@/mocks/infoDetail";
import DetailHeader from "./components/Detail/DetailHeader";
import AIChatButton from "@/components/AIChatButton";
import BusinessHoursSection from "./components/Detail/BusinessHoursSection";
import LocationSection from "./components/Detail/LocationSection";
import ReviewSection from "./components/Detail/review/ReviewSection";
import SummaryCard from "./components/Detail/SummaryCard";

export default function InfoDetailPage() {
  const { category } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const navigate = useNavigate();
  const detail = infoDetailMockData.result;
  const reviewData = infoReviewMockData.result;

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getInfoDetail(id!);

  //     setBreadcrumb([
  //       "정보",
  //       infoCategoryMap[category as ParentCategory].label,
  //       data.name,
  //     ]);
  //   }

  //   fetchData();
  // }, [category, id, setBreadcrumb]);

  // 임시
  useEffect(() => {
  if (!category) return;

  setBreadcrumb([
    {
      label: "정보",
      onClick: () => {},
    },
    {
      label: infoCategory?.label ?? "",
      onClick: () => navigate(`/info?category=${category}`),
    },
    {
      label: detail.name,
    },
  ]);

  return () => setBreadcrumb([]);
}, [category, detail.name, infoCategory, navigate, setBreadcrumb]);

  return (
    <div className="mx-auto flex max-w-[1240px] gap-6 px-8 py-5">
      {/* left */}
      <main className="flex-1 space-y-5">
        <DetailHeader image={undefined} />
        {/* <IntroSection
          introduction={detail.introduction}
          tags={detail.tags}
        /> */}

        <BusinessHoursSection hours={detail.businessHours} />

        <LocationSection
          address={detail.address}
          homepageUrl={detail.homepageUrl ?? undefined}
        />

        <ReviewSection
          reviews={reviewData.reviews}
          averageRating={reviewData.avgRating}
          totalReviewCount={reviewData.totalCount}
          onWriteReview={() => {
            // 후기 작성 페이지 이동 
          }}
        />
      </main>

      {/* right */}
      <aside className=" top-5 h-fit w-[400px] space-y-4">
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