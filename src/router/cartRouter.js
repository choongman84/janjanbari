import React, { lazy, Suspense } from "react";

const CartListPage = lazy(() => import("../pages/cart/CartListPage"));

const cartRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CartListPage />
      </Suspense>
    ),
  },
];

export default cartRouter;
