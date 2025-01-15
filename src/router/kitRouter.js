import React, { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;

const KitListPage = lazy(() => import("../pages/Kits/KitListPage"));
const KitDetailPage = lazy(() => import("../pages/Kits/KitDetailPage"));
// const KitOrderPage = lazy(() => import("../pages/Kits/KitOrderPage"));
// const KitAddPage = lazy(() => import("../pages/Kits/KitAddPage"));
// const CartPage = lazy(() => import("../pages/cart/CartPage"));

const kitRouter = () => {
  console.log("kitRouter");
  return [
    {
      path: "", // /kit/list 전체 상품조회.
      element: (
        <Suspense fallback={Loading}>
          <KitListPage />
        </Suspense>
      ),
    },
    {
      path: "detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <KitDetailPage />
        </Suspense>
      )
    }
  ];
};

export default kitRouter;
