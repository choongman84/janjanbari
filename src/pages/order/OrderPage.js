import React from 'react';
import OrderComponent from '../../components/order/OrderComponent';

const OrderPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문하기</h1>
      <OrderComponent />
    </div>
  );
};

export default OrderPage;
