import React, { lazy, Suspense } from 'react'


const Loading = <div>Loading...</div>;

const PaymentProcessPage = lazy(() => import("../pages/payment/PaymentProcessPage"));
const PaymentCompletePage = lazy(() => import("../pages/payment/PaymentCompletePage"));
const PaymentFailPage = lazy(() => import("../pages/payment/PaymentFailPage"));
const paymentRouter = () => {
  return [
    {
      path: "process",
      element: (
        <Suspense fallback={Loading}>
          <PaymentProcessPage />
        </Suspense>
      ),
    },
    {
      path: "complete",
      element: (
        <Suspense fallback={Loading}>
          <PaymentCompletePage />
        </Suspense>
      ),
    },
    {
      path: "fail",
      element: (
        <Suspense fallback={Loading}>
          <PaymentFailPage />
        </Suspense>
      ),
    },
  ];
};

export default paymentRouter