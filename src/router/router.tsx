import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import InfoPage from "@/pages/info/InfoPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import AuthPage from "@/pages/auth/AuthPage";
import NewsPage from "@/pages/news/NewsPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import WriteReviewPage from "@/pages/info/WriteReviewPage";
import CommunityPage from "@/pages/community/CommunityPage";
import CommunityDetailPage from "@/pages/community/CommunityDetailPage";
import CommunityWritePage from "@/pages/community/CommunityWritePage";

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
        path: "/news",
        element: <NewsPage />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
      {
        path: "/community/:id",
        element: <CommunityDetailPage />,
        handle: { header: "back" },
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
      {
        path: "/news/:sourceTab/:id",
        element: <NewsDetailPage />,
      },
      {
        path: "/info/:category/:id/review/write",
        element: <WriteReviewPage />,
      },
      {
        path: "/community/write",
        element: <CommunityWritePage />,
      },
    ],
  },
]);
