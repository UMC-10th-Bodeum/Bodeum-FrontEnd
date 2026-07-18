export type NewsTabValue = "activity" | "region";

interface NewsTabsProps {
  value: NewsTabValue;
  onChange: (value: NewsTabValue) => void;
}

const newsTabs = [
  { value: "activity", label: "활동소식" },
  { value: "region", label: "지역소식" },
] as const satisfies readonly { value: NewsTabValue; label: string }[];

export default function NewsTabs({ value, onChange }: NewsTabsProps) {
  return (
    <div className="border-b border-background-300">
      <div role="tablist" aria-label="뉴스 탭" className="flex items-end">
        {newsTabs.map((tab) => {
          const selected = tab.value === value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.value)}
              className={`relative h-[36px] cursor-pointer px-3 py-2 text-h4-list transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
                selected ? "text-main-400" : "text-background-500"
              }`}
            >
              {tab.label}
              {selected && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-main-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
