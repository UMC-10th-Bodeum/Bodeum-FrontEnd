import { useState } from "react";
import HomeIcon from "@/assets/icons/Home.svg?react";
import ChatIcon from "@/assets/icons/Chat.svg?react";
import InfoIcon from "@/assets/icons/Info.svg?react";
import NewsIcon from "@/assets/icons/News.svg?react";
import CommunityIcon from "@/assets/icons/Community.svg?react";
import SideNavItem from "./SideNavItem";
import SideSubNavItem from "./SideSubNavItem";

const subMenus = ["기관", "병원", "복지", "취업", "교육"];

export default function SideNav() {
  const [selectedMenu, setSelectedMenu] = useState("정보");
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>("기관");

  return (
    <nav className="flex flex-col gap-[10px]">
      <SideNavItem
        icon={<HomeIcon />}
        label="홈"
        active={selectedMenu === "홈"}
        onClick={() => setSelectedMenu("홈")}
      />

      <SideNavItem
        icon={<ChatIcon />}
        label="AI 챗봇"
        active={selectedMenu === "AI 챗봇"}
        onClick={() => setSelectedMenu("AI 챗봇")}
      />

      <SideNavItem
        icon={<InfoIcon />}
        label="정보"
        active={selectedMenu === "정보"}
        expanded={selectedMenu === "정보"}
        onClick={() => setSelectedMenu("정보")}
      >
        <div className="flex flex-col gap-[12px]">
          {subMenus.map((menu) => (
            <SideSubNavItem
              key={menu}
              label={menu}
              selected={selectedSubMenu === menu}
              onClick={() => setSelectedSubMenu(menu)}
            />
          ))}
        </div>
      </SideNavItem>

      <SideNavItem
        icon={<NewsIcon />}
        label="소식"
        active={selectedMenu === "소식"}
        onClick={() => setSelectedMenu("소식")}
      />

      <SideNavItem
        icon={<CommunityIcon />}
        label="커뮤니티"
        active={selectedMenu === "커뮤니티"}
        onClick={() => setSelectedMenu("커뮤니티")}
      />
    </nav>
  );
}