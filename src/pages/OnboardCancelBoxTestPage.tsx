import OnboardCancelBox from '@/components/OnboardCancelBox';

export default function OnboardCancelBoxTestPage() {
  return (
    <main className="min-h-screen bg-background-500 px-[48px] py-[40px]">
      <section className="flex flex-col gap-[16px]">
        <h1 className="text-h2-list text-background-100">OnboardCancelBox</h1>
        <OnboardCancelBox
          title="온보딩을 중단하시겠어요?"
          description={`지금 종료하시면 작성 중이던 정보가 저장되지 않습니다.
맞춤형 서비스 이용을 위한 기본 정보는 로그인 후
[마이페이지 > 설정]에서 언제든 다시 작성하실 수 있습니다.`}
          leftButtonText="계속하기"
          rightButtonText="중단하기"
        />
      </section>
    </main>
  );
}
