export type AiChatScenario =
  | "first-entry"
  | "login-required"
  | "consent-required";

type AiChatStateSwitcherProps = {
  activeScenario: AiChatScenario;
  onChange: (scenario: AiChatScenario) => void;
};

const scenarios: Array<{
  value: AiChatScenario;
  number: string;
  label: string;
}> = [
  {
    value: "first-entry",
    number: "1",
    label: "로그인 O · 최초 진입",
  },
  {
    value: "login-required",
    number: "2",
    label: "로그인 X · 로그인 유도",
  },
  {
    value: "consent-required",
    number: "3",
    label: "로그인 O · 챗봇 미동의",
  },
];

export default function AiChatStateSwitcher({
  activeScenario,
  onChange,
}: AiChatStateSwitcherProps) {
  return (
    <aside
      aria-label="AI 챗봇 임시 상태 선택"
      className="fixed right-[18px] top-[280px] z-[70] flex w-[220px] flex-col gap-[8px] rounded-[12px] border border-background-250 bg-background-100 p-[12px] shadow-button"
    >
      <div className="flex items-center justify-between px-[2px]">
        <p className="text-h6 text-background-600">임시 상태 전환</p>
        <span className="rounded-full bg-sub-yellow-2 px-[7px] py-[2px] text-body-label-2 text-sub-yellow">
          TEMP
        </span>
      </div>

      <div className="flex flex-col gap-[6px]">
        {scenarios.map((scenario) => {
          const isActive = activeScenario === scenario.value;

          return (
            <button
              key={scenario.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(scenario.value)}
              className={`flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] border px-[10px] py-[8px] text-left text-h6-list transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
                isActive
                  ? "border-main-400 bg-main-150 text-main-400"
                  : "border-background-250 bg-background-100 text-background-500 hover:bg-background-200"
              }`}
            >
              <span
                className={`flex size-[20px] shrink-0 items-center justify-center rounded-full text-body-label ${
                  isActive
                    ? "bg-main-400 text-background-100"
                    : "bg-background-250 text-background-500"
                }`}
              >
                {scenario.number}
              </span>
              <span>{scenario.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
