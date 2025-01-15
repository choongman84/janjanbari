import React from 'react'
import PaymentProcessComponent from '../../components/payment/PaymentProcessComponent';

const PaymentProcessPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">결제 페이지</h1>
      <PaymentProcessComponent />
    </div>
  );
}

export default PaymentProcessPage