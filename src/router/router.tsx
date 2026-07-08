import { createBrowserRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MainLayout from "../layouts/MainLayout";
import MainButtonTestPage from "../pages/MainButtonTestPage";
import HomePage from "../pages/home/HomePage";

export const router = createBrowserRouter([
  {
    element: <EmptyLayout />,
    children: [
      {
        path: "/main-button-test",
        element: <MainButtonTestPage />,
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
