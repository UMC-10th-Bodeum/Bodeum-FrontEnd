import { createBrowserRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MainLayout from "../layouts/MainLayout";
import OnboardCancelBoxTestPage from "../pages/OnboardCancelBoxTestPage";
import OnboardBoxFrameTestPage from "../pages/OnboardBoxFrameTestPage";
import HomePage from "../pages/home/HomePage";

export const router = createBrowserRouter([
  {
    element: <EmptyLayout />,
    children: [
      {
        path: "/onboard-cancel-box-test",
        element: <OnboardCancelBoxTestPage />,
      },
      {
        path: "/onboard-box-frame-test",
        element: <OnboardBoxFrameTestPage />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
