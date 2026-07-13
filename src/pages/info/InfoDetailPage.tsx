import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  infoCategoryMap,
  type InfoCategoryType,
} from "@/constants/infoCategory"

export default function InfoDetailPage() {
  const { category, id } = useParams();
  const { setBreadcrumb } = useBreadcrumb();
  const navigate = useNavigate();

  const infoCategory = category
    ? infoCategoryMap[category as InfoCategoryType]
    : undefined;

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getInfoDetail(id!);

  //     setBreadcrumb([
  //       "정보",
  //       infoCategoryMap[category as InfoCategoryType].label,
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
        label: "병원",
        onClick: () => navigate("/info?category=HOSPITAL"),
      },
      {
        label: "드림발달클리닉",
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category, setBreadcrumb]);

  return (
    <div className="flex min-h-screen flex-col px-[32px] py-[20px] bg-background-100 gap-[18px]">
      <h1 className="text-h5-bold text-gray-900">InfoDetail</h1>
      <span className="text-body2 text-gray-500">
        {infoCategory?.label} &gt; {id}
      </span>
    </div>
  )
}