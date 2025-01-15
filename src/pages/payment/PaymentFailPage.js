import React from "react";
import PaymentFailComponent from "../../components/payment/PaymentFailComponent";

const PaymentFailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">결제 실패 페이지</h1>
      <PaymentFailComponent />
    </div>
  );
};

export default PaymentFailPage;
