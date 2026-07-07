import './App.css'
import MainButton from './components/MainButton'

function App() {
  return (
    <main className="min-h-screen bg-background-100 p-10">
      <div className="flex flex-col items-start gap-4">
        <MainButton size="L">다음</MainButton>
        <MainButton size="L" disabled>
          다음
        </MainButton>

        <MainButton size="M">다음</MainButton>
        <MainButton size="M" disabled>
          다음
        </MainButton>

        <MainButton size="S">다음</MainButton>
        <MainButton size="S" disabled>
          다음
        </MainButton>

        <MainButton size="S" stroke>
          다음
        </MainButton>
        <MainButton size="S" stroke disabled>
          다음
        </MainButton>
      </div>
    </main>
  )
}

export default App
