import { Outlet, useMatches } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import SearchTopBar from "./components/Header/SearchTopBar";
import BackTopBar from "./components/Header/BackTopBar";

export default function MainLayout() {
  const matches = useMatches();
  const current = matches[matches.length - 1];

  const header = (current.handle as { header?: string })?.header;

  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-1 flex-col overflow-x-auto">
        {header === "back" ? <BackTopBar /> : <SearchTopBar />}

        <main className="flex-1 overflow-auto">
          <div className="min-w-[1227px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}