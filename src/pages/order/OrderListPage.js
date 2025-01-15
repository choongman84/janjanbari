import React from 'react';
import OrderListComponent from '../../components/order/OrderListComponent';

const OrderListPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
      <OrderListComponent />
    </div>
  );
};

export default OrderListPage;
