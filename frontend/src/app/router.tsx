import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../components/layout/RootLayout";
import { BookEventPage } from "../pages/BookEventPage";
import { HomePage } from "../pages/HomePage";
import { OwnerBookingsPage } from "../pages/OwnerBookingsPage";
import { OwnerEventTypesPage } from "../pages/OwnerEventTypesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "book/:eventTypeId",
        element: <BookEventPage />,
      },
      {
        path: "owner/event-types",
        element: <OwnerEventTypesPage />,
      },
      {
        path: "owner/bookings",
        element: <OwnerBookingsPage />,
      },
    ],
  },
]);
