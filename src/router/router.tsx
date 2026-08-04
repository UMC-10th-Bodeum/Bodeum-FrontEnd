import { createBrowserRouter, Outlet } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import AIChatPage from "@/pages/AIchat/AIChatPage";
import AuthPage from "@/pages/auth/AuthPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";
import InfoPage from "@/pages/info/InfoPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import NewsPage from "@/pages/news/NewsPage";
import WriteReviewPage from "@/pages/info/WriteReviewPage";
import CommunityPage from "@/pages/community/CommunityPage";
import CommunityDetailPage from "@/pages/community/CommunityDetailPage";
import CommunityWritePage from "@/pages/community/CommunityWritePage";
import AuthStateGate from "@/pages/auth/components/AuthStateGate";
import AuthBrowserSessionGuard from "@/pages/auth/components/AuthBrowserSessionGuard";
import ProtectedRoute from "@/pages/auth/components/ProtectedRoute";
import MyPage from "@/pages/mypage/MyPage";
import ProfileSettingsPage from "@/pages/mypage/ProfileSettingsPage";
import MyPageProfileProvider from "@/pages/mypage/MyPageProfileProvider";

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
          {
            path: "/community",
            element: <CommunityPage />,
          },
          {
            path: "/community/:id",
            element: <CommunityDetailPage />,
            handle: { header: "back" },
          },
          {
            path: "/mypage",
            element: (
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <MyPage />,
              },
              {
                path: "settings",
                element: (
                  <MyPageProfileProvider>
                    <ProfileSettingsPage />
                  </MyPageProfileProvider>
                ),
              },
            ],
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
            path: "/news/:id",
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
    ],
  },
]);
