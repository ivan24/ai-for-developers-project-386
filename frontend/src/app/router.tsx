import { createBrowserRouter } from "react-router-dom";
import { BookEventPage } from "@/pages/book-event/ui/BookEventPage";
import { HomePage } from "@/pages/home/ui/HomePage";
import { OwnerBookingsPage } from "@/pages/owner-bookings/ui/OwnerBookingsPage";
import { OwnerEventTypesPage } from "@/pages/owner-event-types/ui/OwnerEventTypesPage";
import { RootLayout } from "@/widgets/root-layout/ui/RootLayout";

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
        path: "dashboard/event-types",
        element: <OwnerEventTypesPage />,
      },
      {
        path: "dashboard/bookings",
        element: <OwnerBookingsPage />,
      },
    ],
  },
]);
