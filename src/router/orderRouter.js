import React, { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;

const OrderPage = lazy(() => import("../pages/order/OrderPage"));
const OrderDetailPage = lazy(() => import("../pages/order/OrderDetailPage"));
const OrderListPage = lazy(() => import("../pages/order/OrderListPage"));

const orderRouter = () => {
  return [
    {
      path: ":memberId", // /orders
      element: (
        <Suspense fallback={Loading}>
          <OrderPage />
        </Suspense>
      ),
    },
    {
      path: ":memberId/detail/:orderId", // /orders/detail
      element: (
        <Suspense fallback={Loading}>
          <OrderDetailPage />
        </Suspense>
      ),
    },
    {
      path: "list", // /orders/list
      element: (
        <Suspense fallback={Loading}>
          <OrderListPage />
        </Suspense>
      ),
    },
  ];
};

export default orderRouter;
