import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { SyncLoader } from "react-spinners";
import ScrollToTop from "../components/ScrollToTop";
import kitRouter from "./kitRouter";
import memberRouter from "./memberRouter";
import adminRouter from "./adminRouter";
import boardRouter from "./boardRouter";
import ticketRouter from "./ticketRouter";
import cartRouter from "./cartRouter";
import wishlistRouter from "./wishlistRouter";
import orderRouter from "./orderRouter";
import paymentRouter from "./paymentRouter";

// Loading Component
const Loading = (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <SyncLoader color="#36d7b7" loading={true} size={15} />
  </div>
);

// Lazy-loaded Pages
const MainPage = lazy(() => import("../pages/MainPage"));

// Root Router Configuration
const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <AppLayout />
      </>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={Loading}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: "kits/*",
        children: kitRouter(),
      },
      {
        path: "members/*",
        children: memberRouter(),
      },
      {
        path: "admin/*",
        children: adminRouter(),
      },
      {
        path: "board/*",
        children: boardRouter(),
      },
      {
        path: "ticket/*",
        children: ticketRouter(),
      },
      {
        path: "cart/*",
        children: cartRouter(),
      },
      {
        path: "wishlist/*",
        children: wishlistRouter(),
      },
      {
        path: "orders/*",
        children : orderRouter(),
      },
      {
        path: "payments/*",
        children: paymentRouter(),
      },
    ],
  },
]);

export default root;
