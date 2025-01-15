import React from 'react'
import PaymentCompleteComponent from '../../components/payment/PaymentCompleteComponent';

const PaymentCompletePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">결제 완료 페이지</h1>
      <PaymentCompleteComponent />
    </div>
  );
}

export default PaymentCompletePage