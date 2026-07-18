import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import InfoPage from "@/pages/info/InfoPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import AuthPage from "@/pages/auth/AuthPage";
import NewsPage from "@/pages/news/NewsPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";

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
        path: "/news/:id",
        element: <NewsDetailPage />,
      },
    ],
  },
]);
