import React, { lazy, Suspense } from "react";
import TicketEditPage from "../components/ticket/TicketEditPage";
// import TicketBrowserPage from "../pages/ticket/TicketBrowserPage";

const Loading = <div>Loading...</div>;

const TicketAddPage = lazy(() => import("../pages/ticket/TicketAddPage"));
const TicketListPage = lazy(() => import("../pages/ticket/TicketListPage"));
const TicketBrowserPage = lazy(() => import("../pages/ticket/TicketBrowserPage"));

const ticketRouter = () => [
    {
        path: "add",
        element: <Suspense fallback={Loading}><TicketAddPage /></Suspense>
    },
    {
        path: "list",
        element: <Suspense fallback={Loading}><TicketListPage /></Suspense>
    },
    {
        path: "reserved-seats/:gameId",
        element: <Suspense fallback={Loading}><TicketAddPage /></Suspense>
    },
      {
    path: 'detailList',
    element: <TicketBrowserPage />,
  },
  {
    path: 'edit/:ticketId',
    element: <TicketEditPage  />,
  },
];

export default ticketRouter;
