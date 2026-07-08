import MainButton from "../components/MainButton";

export default function MainButtonTestPage() {
  return (
    <main className="min-h-screen bg-background-200 px-[40px] py-[36px]">
      <div className="flex flex-col items-start gap-[32px]">
        <h1 className="text-h1-onboard text-background-600">
          Main Button Test
        </h1>

        <section className="flex flex-col items-start gap-[12px]">
          <h2 className="text-h2-list text-background-600">Filled L</h2>
          <MainButton size="L">L 기본</MainButton>
          <MainButton size="L" disabled>
            L disabled
          </MainButton>
        </section>

        <section className="flex flex-col items-start gap-[12px]">
          <h2 className="text-h2-list text-background-600">Filled M</h2>
          <MainButton size="M">M 기본</MainButton>
          <MainButton size="M" disabled>
            M disabled
          </MainButton>
        </section>

        <section className="flex flex-col items-start gap-[12px]">
          <h2 className="text-h2-list text-background-600">Filled S</h2>
          <MainButton size="S">S 기본</MainButton>
          <MainButton size="S" disabled>
            S disabled
          </MainButton>
        </section>

        <section className="flex flex-col items-start gap-[12px]">
          <h2 className="text-h2-list text-background-600">Stroke S</h2>
          <MainButton size="S" stroke>
            S stroke
          </MainButton>
          <MainButton size="S" stroke disabled>
            S disabled
          </MainButton>
        </section>
      </div>
    </main>
  );
}
