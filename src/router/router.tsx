import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import InfoPage from "@/pages/info/InfoPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import AuthPage from "@/pages/auth/AuthPage";
import CommunityPage from "@/pages/community/CommunityPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/info",
        element: <InfoPage />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    element: <DetailLayout />,
    children: [
      {
        path: "/info/:category/:id",
        element: <InfoDetailPage />,
      },
    ],
  },
]);
