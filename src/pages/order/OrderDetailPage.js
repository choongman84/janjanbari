import React from 'react';
import OrderDetailComponent from '../../components/order/OrderDetailComponent';

const OrderDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문/결제</h1>
      <OrderDetailComponent />
    </div>
  );
};

export default OrderDetailPage;
