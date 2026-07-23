import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import InfoPage from "@/pages/info/InfoPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import AuthPage from "@/pages/auth/AuthPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import NewsPage from "@/pages/news/NewsPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import AuthStateGate from "@/pages/auth/components/AuthStateGate";
import AuthBrowserSessionGuard from "@/pages/auth/components/AuthBrowserSessionGuard";

export const router = createBrowserRouter([
  {
    element: <AuthBrowserSessionGuard />,
    children: [
      {
        element: (
          <AuthStateGate>
            <MainLayout />
          </AuthStateGate>
        ),
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
        path: "/auth/callback",
        element: <AuthCallbackPage />,
      },
      {
        element: (
          <AuthStateGate>
            <DetailLayout />
          </AuthStateGate>
        ),
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
    ],
  },
]);
