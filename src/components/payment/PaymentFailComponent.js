import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, orderInfo } = location.state || {};

  // 로그인 정보 가져오기
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    if (!error || !orderInfo) {
      navigate("/orders/list");
      return;
    }
  }, [auth, error, orderInfo, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-red-600">결제 실패</h2>
          <p className="text-gray-600 mt-2">
            결제 처리 중 오류가 발생했습니다.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <h3 className="font-semibold">오류 내용</h3>
            <p className="text-red-500">{error}</p>
          </div>
          <div>
            <h3 className="font-semibold">주문 정보</h3>
            <p>주문번호: {orderInfo?.orderId}</p>
            <p>결제금액: ₩{orderInfo?.totalAmount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <button
            onClick={() =>
              navigate("/payments/process", {
                state: { orderData: orderInfo },
              })
            }
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate("/orders/list")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            주문 내역으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailComponent;
