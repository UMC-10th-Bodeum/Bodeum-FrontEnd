import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityPointCard from "./components/ActivityPointCard";
import BadgeGradeModal from "./components/BadgeGradeModal";
import BadgeHelpModal from "./components/BadgeHelpModal";
import MyPageCard from "./components/MyPageCard";
import MyPageTabs from "./components/MyPageTabs";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import { initialMyPageCounts, initialMyPageItems } from "./data/myPageData";
import type { MyPageTabKey } from "./types";

type BadgeModalType = "grade" | "help" | null;

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MyPageTabKey>("saved");
  const [items, setItems] = useState(initialMyPageItems);
  const [counts, setCounts] = useState(initialMyPageCounts);
  const [badgeModal, setBadgeModal] = useState<BadgeModalType>(null);

  const deleteItem = (id: number) => {
    setItems((current) => ({
      ...current,
      [activeTab]: current[activeTab].filter((item) => item.id !== id),
    }));
    setCounts((current) => ({
      ...current,
      [activeTab]: Math.max(0, current[activeTab] - 1),
    }));
  };

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <div className="mx-auto w-[896px]">
        <ProfileSummaryCard counts={counts} onSettingsClick={() => navigate("/mypage/settings")} />

        <div className="mt-[18px] grid grid-cols-[576px_299px] gap-x-[18px] gap-y-[16px]">
          <section className="col-start-1 row-start-1">
            <MyPageTabs activeTab={activeTab} onChange={setActiveTab} />
          </section>

          <div className="col-start-1 row-start-2 flex flex-col gap-[8px]">
            {items[activeTab].map((item) => (
              <MyPageCard
                key={item.id}
                item={item}
                onDelete={() => deleteItem(item.id)}
              />
            ))}

            {items[activeTab].length === 0 && (
              <div className="flex h-[144px] items-center justify-center rounded-[10px] border border-background-250 bg-background-100 text-[13px] text-background-500">
                표시할 항목이 없습니다.
              </div>
            )}
          </div>

          <div className="col-start-2 row-start-2 self-start">
            <ActivityPointCard
              onOpenBadgeGrade={() => setBadgeModal("grade")}
              onOpenBadgeHelp={() => setBadgeModal("help")}
            />
          </div>
        </div>
      </div>

      {badgeModal === "grade" && <BadgeGradeModal onClose={() => setBadgeModal(null)} />}
      {badgeModal === "help" && <BadgeHelpModal onClose={() => setBadgeModal(null)} />}
    </div>
  );
}
