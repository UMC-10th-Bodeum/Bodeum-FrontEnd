import CommunitySection from "./components/CommunitySection";
import NoticeBanner from "./components/NoticeBanner";
import RecommendedNewsSection from "./components/RecommendedNewsSection";
import RequiredInfoSection from "./components/RequiredInfoSection";
import { useRecommendedNews } from "@/hooks/useHome";

export default function HomePage() {
  const { data: news = [], isPending, isError } = useRecommendedNews();

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center text-h2-list text-background-500">
        불러오는 중입니다...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center text-h2-list text-background-500">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

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
