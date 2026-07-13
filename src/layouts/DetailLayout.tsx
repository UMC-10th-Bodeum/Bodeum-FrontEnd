import { Outlet } from "react-router-dom";
import BackTopBar from "./components/Header/BackTopBar";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

export default function DetailLayout() {
  return (
    <BreadcrumbProvider>
      <div className="flex h-screen flex-col">
        <BackTopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </BreadcrumbProvider>
  );
}