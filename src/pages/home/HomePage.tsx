import CommunitySection from "./components/CommunitySection";
import NoticeBanner from "./components/NoticeBanner";
import RecommendedNewsSection from "./components/RecommendedNewsSection";
import RequiredInfoSection from "./components/RequiredInfoSection";
import { useRecommendedNews } from "@/hooks/useHome";

export default function HomePage() {
  const { data: news = [], isPending, isError } = useRecommendedNews();

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background-100">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[18px] px-[32px] py-[20px]">
        <NoticeBanner title="2026년 발달재활서비스 바우처 신청 기간 안내 — D-7" description="5월 31일까지 복지로에서 신청 가능합니다" />

        <RequiredInfoSection />

        <RecommendedNewsSection news={news} />
      
        <CommunitySection />
      </div>
    </div>
  );
}
