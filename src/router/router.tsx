import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import AIChatPage from "@/pages/AIchat/AIChatPage";
import AuthPage from "@/pages/auth/AuthPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import InfoPage from "@/pages/info/InfoPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import NewsPage from "@/pages/news/NewsPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/aichat",
        element: <AIChatPage />,
      },
      {
        path: "/info",
        element: <InfoPage />,
      },
      {
        path: "/news",
        element: <NewsPage />,
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
    ],
  },
]);
