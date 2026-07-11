import { createBrowserRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import InfoPage from "@/pages/info/InfoPage";
import DetailLayout from "@/layouts/DetailLayout";
import InfoDetailPage from "@/pages/info/InfoDetailPage";

export const router = createBrowserRouter([
  {
    element: <EmptyLayout />,
    // children: [
    //   {
    //     path: "/onboarding",
    //     element: <OnboardingPage />,
    //   },
    // ],
  },
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
    ],
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
