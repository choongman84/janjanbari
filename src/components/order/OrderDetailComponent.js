import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrderFromKit, createOrderFromCart } from '../api/orderApi';

const OrderDetailComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderItems, totalAmount } = location.state || {};
  const [auth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [orderInfo, setOrderInfo] = useState({
    receiver: "",
    receiverPhone: "",
    address: {
      zipcode: "",
      address: "",
      detailAddress: "",
    },
    deliveryMessage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrderInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOrderInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        ...orderInfo,
        orderItems,
        totalAmount
      };

      // 장바구니 주문인지 단일 상품 주문인지 구분
      const response = orderItems.length > 1 
        ? await createOrderFromCart(auth.user.id, orderData)
        : await createOrderFromKit(auth.user.id, orderItems[0].kitId, orderData);

      alert("주문이 완료되었습니다.");
      navigate("/order/list");
    } catch (error) {
      console.error("주문 처리 실패:", error);
      alert(error.response?.data || "주문 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">주문/결제</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">배송 정보</h3>
          
          <div>
            <label className="block mb-2">받는 사람</label>
            <input
              type="text"
              name="receiver"
              value={orderInfo.receiver}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">연락처</label>
            <input
              type="tel"
              name="receiverPhone"
              value={orderInfo.receiverPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">주소</label>
            <div className="space-y-2">
              <input
                type="text"
                name="address.zipcode"
                value={orderInfo.address.zipcode}
                onChange={handleInputChange}
                placeholder="우편번호"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address.address"
                value={orderInfo.address.address}
                onChange={handleInputChange}
                placeholder="기본주소"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address.detailAddress"
                value={orderInfo.address.detailAddress}
                onChange={handleInputChange}
                placeholder="상세주소"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">배송 메시지</label>
            <textarea
              name="deliveryMessage"
              value={orderInfo.deliveryMessage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">결제 금액</h3>
          <p className="text-2xl font-bold text-right">
            ₩{totalAmount.toLocaleString()}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700"
        >
          결제하기
        </button>
      </form>
    </div>
  );
};

export default OrderDetailComponent;