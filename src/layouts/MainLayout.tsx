import { Outlet } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import SearchTopBar from "./components/Header/SearchTopBar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-1 flex-col">
        <SearchTopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}