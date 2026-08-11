import CommunitySection from "./components/CommunitySection";
import NoticeBanner from "./components/NoticeBanner";
import RecommendedNewsSection from "./components/RecommendedNewsSection";
import RequiredInfoSection from "./components/RequiredInfoSection";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background-100">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[18px] px-[32px] py-[20px] mb-[44px]">
        <NoticeBanner />

        <RequiredInfoSection />

        <RecommendedNewsSection />
      
        <CommunitySection />
      </div>
    </div>
  );
}
