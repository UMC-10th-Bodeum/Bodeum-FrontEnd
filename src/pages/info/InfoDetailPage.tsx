import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import { mockInfoDetail } from "@/mocks/infoDetail";
import DetailHeader from "./components/Detail/DetailHeader";
import AIChatButton from "@/components/AIChatButton";

export default function InfoDetailPage() {
  const { category, id } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const navigate = useNavigate();
  const detail = mockInfoDetail;

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
        onClick: () => {
          // 모달 열기
        },
      },
      {
        label: infoCategory?.label ?? "",
        onClick: () => navigate(`/info?category=${category}`),
      },
      {
        label: "드림발달클리닉",
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category, setBreadcrumb]);

  return (
    <div className="mx-auto flex max-w-[1240px] gap-6 px-8 py-5">
      {/* left */}
      <main className="flex-1 space-y-5">
        <DetailHeader image={detail.thumbnail} />
        <h1>{id}</h1>

        {/* <IntroSection data={detail} /> */}

        {/* <BusinessHoursSection hours={detail.hours} /> */}

        {/* <LocationSection location={detail.location} /> */}

        {/* <ReviewSection /> */}
      </main>

      {/* right */}
      <aside className="sticky top-5 h-fit w-[400px] space-y-4">
        {/* <SummaryCard data={detail} /> */}
        <AIChatButton />
        {/* <FloatingChatCard /> */}
      </aside>
    </div>
  )
}