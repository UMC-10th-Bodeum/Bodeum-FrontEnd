import NoticeBanner from "./components/NoticeBanner";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col px-[32px] py-[20px] bg-background-100">
      <NoticeBanner title="2026년 발달재활서비스 바우처 신청 기간 안내 — D-7" description="5월 31일까지 복지로에서 신청 가능합니다" />
    </div>
  );
}