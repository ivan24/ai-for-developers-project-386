import { Navigate, createBrowserRouter } from "react-router-dom";
import { OwnerLayout } from "../components/shared/owner-layout";
import { RootLayout } from "../components/shared/page-shell";
import { RouteErrorBoundary } from "../components/shared/route-error";
import { BookingCheckoutPage } from "../pages/guest/booking-checkout-page";
import { BookEventPage } from "../pages/guest/book-event-page";
import { GuestBookingPage } from "../pages/guest/guest-booking-page";
import { PublicEventTypesPage } from "../pages/guest/public-event-types-page";
import { NotFoundPage } from "../pages/not-found-page";
import { OwnerBookingDetailsPage } from "../pages/owner/owner-booking-details-page";
import { OwnerBookingsPage } from "../pages/owner/owner-bookings-page";
import { OwnerEventTypesPage } from "../pages/owner/owner-event-types-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <PublicEventTypesPage />,
      },
      {
        path: "book/:eventTypeId",
        element: <BookEventPage />,
      },
      {
        path: "book/:eventTypeId/checkout",
        element: <BookingCheckoutPage />,
      },
      {
        path: "booking/:guestCancelToken",
        element: <GuestBookingPage />,
      },
      {
        path: "owner",
        element: <OwnerLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="bookings" />,
          },
          {
            path: "event-types",
            element: <OwnerEventTypesPage />,
          },
          {
            path: "bookings",
            element: <OwnerBookingsPage />,
          },
          {
            path: "bookings/:bookingId",
            element: <OwnerBookingDetailsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
