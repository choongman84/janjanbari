import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderList } from '../api/orderApi';
import { API_SERVER_HOST } from '../api/api';

const OrderListComponent = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [auth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    try {
      const data = await getOrderList(auth.user.id);
      setOrders(data);
    } catch (error) {
      console.error("주문 목록 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/members/login");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">주문 내역</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p>주문 내역이 없습니다.</p>
          <button
            onClick={() => navigate("/kits")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    주문일자: {formatDate(order.orderDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    주문번호: {order.id}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                  {order.status}
                </span>
              </div>
              
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-t">
                  <img
                    src={`${API_SERVER_HOST}/${item.imgUrl}`}
                    alt={item.kitName}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.kitName}</h3>
                    <p>사이즈: {item.size}</p>
                    {item.customization && (
                      <div className="text-sm text-gray-600">
                        {item.customization.patch && (
                          <p>패치: {item.customization.patchType}</p>
                        )}
                        {item.customization.customName && (
                          <p>이름: {item.customization.customName}</p>
                        )}
                        {item.customization.customNumber && (
                          <p>번호: {item.customization.customNumber}</p>
                        )}
                      </div>
                    )}
                    <p className="mt-2">
                      ₩{item.totalPrice.toLocaleString()} / {item.quantity}개
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t text-right">
                <p className="text-xl font-bold">
                  총 결제금액: ₩{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderListComponent;