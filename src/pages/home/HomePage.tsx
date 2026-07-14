import { communityPosts } from "@/mocks/community";
import CommunitySection from "./components/CommunitySection";
import NoticeBanner from "./components/NoticeBanner";
import RecommendedNewsSection from "./components/RecommendedNewsSection";
import RequiredInfoSection from "./components/RequiredInfoSection";

const news = [
  {
    id: 1,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 2,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 3,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 4,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
  {
    id: 5,
    title: "2026 발달재활서비스 바우처 신청 안내",
    region: "서울",
    category: "강남구",
    dDay: 21,
    views: 1204,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col px-[32px] py-[20px] bg-background-100 gap-[18px]">
      <NoticeBanner title="2026년 발달재활서비스 바우처 신청 기간 안내 — D-7" description="5월 31일까지 복지로에서 신청 가능합니다" />

      <RequiredInfoSection />

      <RecommendedNewsSection news={news} />
      
      <CommunitySection
        posts={communityPosts}
      />
    </div>
  );
}
