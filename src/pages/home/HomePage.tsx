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
        <NoticeBanner />

        <RequiredInfoSection />

        <RecommendedNewsSection news={news} />
      
        <CommunitySection />
      </div>
    </div>
  );
}
