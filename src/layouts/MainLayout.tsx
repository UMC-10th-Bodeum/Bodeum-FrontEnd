import { Outlet } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import TopBar from "./components/TopBar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-1 flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}