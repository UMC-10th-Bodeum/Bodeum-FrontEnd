import { myPageTabs } from "../myPageTabConfig";
import type { MyPageTabKey } from "@/types/mypage";

interface MyPageTabsProps {
  activeTab: MyPageTabKey;
  counts: Record<MyPageTabKey, number>;
  onChange: (tab: MyPageTabKey) => void;
}

export default function MyPageTabs({ activeTab, counts, onChange }: MyPageTabsProps) {
  return (
    <div className="flex h-[37px] border-b border-background-400" role="tablist">
      {myPageTabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`relative h-[38px] cursor-pointer px-4 py-2 text-h3-category-sub ${
              isActive ? "text-main-400" : "text-background-500"
            }`}
          >
            {tab.label} {counts[tab.key]}
            {isActive && <span className="absolute inset-x-0 bottom-[2px] h-[2px] bg-main-400" />}
          </button>
        );
      })}
    </div>
  );
}
