import InfoCategoryCard from "@/components/InfoCategoryCard";
import { useNavigate } from "react-router-dom";

const categories = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
] as const;

export default function RequiredInfoSection() {
  const navigate = useNavigate();
  
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
            count={235}
            onClick={() => navigate(`/info?category=${type}`)}
          />
        ))}
      </div>
    </section>
  );
}