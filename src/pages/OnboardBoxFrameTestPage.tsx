import OnboardBoxFrame from '@/components/OnboardBoxFrame';

export default function OnboardBoxFrameTestPage() {
  return (
    <main className="min-h-screen bg-background-500 px-[48px] py-[40px]">
      <section className="flex flex-col gap-[16px]">
        <h1 className="text-h2-list text-background-100">OnboardBoxFrame</h1>
        <OnboardBoxFrame
          buttonCount={1}
          rightButtonText="다음"
          rightButtonColor="main-400"
          showClose
        >
          <div className="flex w-full max-w-[500px] min-w-0 shrink-0 flex-col items-start gap-[20px]">
            <h2 className="w-full break-words text-h1-onboard text-background-600">
              프레임만 사용한 테스트 박스
            </h2>
            <div className="w-full whitespace-pre-line break-words text-h2-onboard text-background-500">
              내부 내용은 children으로 자유롭게 구성하고, 아래 버튼 개수와 색상,
              오른쪽 위 X 표시만 프레임에서 처리합니다.
            </div>
          </div>
        </OnboardBoxFrame>
      </section>
    </main>
  );
}
