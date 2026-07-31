import HomeIcon from "@/assets/icons/Home.svg?react";
import ChatIcon from "@/assets/icons/Chat.svg?react";
import InfoIcon from "@/assets/icons/Info.svg?react";
import NewsIcon from "@/assets/icons/News.svg?react";
import CommunityIcon from "@/assets/icons/Community.svg?react";
import SideNavItem from "./SideNavItem";
import SideSubNavItem from "./SideSubNavItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { infoCategoryMap } from "@/constants/infoCategory";

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

  const pathname = location.pathname;

  const searchParams = new URLSearchParams(location.search);
  const queryCategory = searchParams.get("category");

  const currentCategory = category ?? queryCategory;

  return (
    <nav className="flex flex-col gap-[10px]">
      <SideNavItem
        icon={<HomeIcon />}
        label="홈"
        active={pathname === "/"}
        onClick={() => navigate("/")}
      />

      <SideNavItem
        icon={<ChatIcon />}
        label="AI 챗봇"
        active={pathname.startsWith("/aichat")}
        onClick={() => navigate("/aichat")}
      />

      <SideNavItem
        icon={<InfoIcon />}
        label="정보"
        active={pathname.startsWith("/info")}
        expanded={pathname.startsWith("/info")}
        onClick={() => navigate("/info?category=INSTITUTION")}
      >
        <div className="flex flex-col gap-[12px]">
          {Object.entries(infoCategoryMap).map(([key, value]) => (
            <SideSubNavItem
              key={key}
              label={value.label}
              selected={currentCategory === key}
              onClick={() => navigate(`/info?category=${key}`)}
            />
          ))}
        </div>
      </SideNavItem>

      <SideNavItem
        icon={<NewsIcon />}
        label="소식"
        active={pathname === "/news"}
        onClick={() => navigate("/news")}
      />

      <SideNavItem
        icon={<CommunityIcon />}
        label="커뮤니티"
        active={pathname.startsWith("/community")}
        onClick={() => navigate("/community")}
      />
    </nav>
  );
}
