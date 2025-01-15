import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as paymentApi from "../api/paymentApi";

const PaymentCompleteComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderInfo, paymentInfo } = location.state || {};
  
  // 로그인 정보 가져오기
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    // 로그인 체크
    if (!auth) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/members/login");
        return;
    }

    // 결제 정보 체크
      if (!orderInfo || !paymentInfo) {
        alert("잘못된 접근입니다.");
      navigate("/orders/list");
      return;
    }

    // 결제 완료 상태 최종 확인
    const confirmPayment = async () => {
        try {
            const status = await paymentApi.getPaymentStatus(paymentInfo.id);
            if (status !== 'COMPLETE') {
                await paymentApi.updatePaymentStatus(paymentInfo.id, "COMPLETE");
            }
        } catch (error) {
            console.error("결제 상태 업데이트 실패:", error);
            alert("결제 상태 업데이트에 실패했습니다.");
            navigate("/orders/list");
        }
    };

    confirmPayment();
  }, [auth, orderInfo, paymentInfo, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-600">결제 완료</h2>
          <p className="text-gray-600 mt-2">주문이 성공적으로 완료되었습니다.</p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <h3 className="font-semibold">주문 번호</h3>
            <p>{orderInfo?.orderId}</p>
          </div>
          <div>
            <h3 className="font-semibold">주문자</h3>
            <p>{auth?.user?.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">결제 금액</h3>
            <p>₩{orderInfo?.totalAmount?.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">결제 수단</h3>
            <p>{paymentInfo?.paymentMethod}</p>
          </div>
          <div>
            <h3 className="font-semibold">결제 일시</h3>
            <p>{new Date(paymentInfo?.payDate).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate("/orders/list")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => navigate("/kits")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleteComponent;
