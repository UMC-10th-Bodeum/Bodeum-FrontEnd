import InfoCategoryCard from "@/components/InfoCategoryCard";
import { useNavigate } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { useInfoItemCounts } from "@/hooks/useHome";

const categories: ParentCategory[] = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
];

export default function RequiredInfoSection() {
  const navigate = useNavigate();
  const { data: counts } = useInfoItemCounts();

  return (
    <section className="overflow-hidden rounded-[10px] bg-background-200 px-[20px] py-[19.6px]">
      <div className="mb-[12px]">
        <h2 className="text-h2-list text-background-600">
          바로 찾는 필수 정보
        </h2>

        <p className="mt-[3.6px] text-h6-list text-background-500">
          필요한 정보를 한번에 바로 찾아보세요
        </p>
      </div>

      <div className="flex gap-[16px]">
        {categories.map((type) => (
          <InfoCategoryCard
            key={type}
            type={type}
            count={
              {
                INSTITUTION: counts?.institution ?? 0,
                HOSPITAL: counts?.hospital ?? 0,
                WELFARE: counts?.welfare ?? 0,
                EMPLOYMENT: counts?.employment ?? 0,
                EDUCATION: counts?.education ?? 0,
              }[type]
            }
            onClick={() => navigate(`/info?category=${type}`)}
          />
        ))}
      </div>
    </section>
  );
}