import { createBrowserRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";

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
    ],
  },
]);
