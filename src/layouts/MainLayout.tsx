import { Outlet, useLocation, useMatches } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import SearchTopBar from "./components/Header/SearchTopBar";
import BackTopBar from "./components/Header/BackTopBar";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { useEffect, useRef } from "react";

export default function MainLayout() {
  const matches = useMatches();
  const current = matches[matches.length - 1];

  const header = (current.handle as { header?: string })?.header;

  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <BreadcrumbProvider>
      <div className="fixed inset-0 flex overflow-hidden">
        <SideBar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {header === "back" ? <BackTopBar /> : <SearchTopBar />}

          <main
            ref={mainRef}
            className="min-h-0 flex-1 overflow-auto"
          >
            <div className="min-w-[1227px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
