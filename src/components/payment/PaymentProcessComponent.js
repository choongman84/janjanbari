import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as paymentApi from "../api/paymentApi";

const PaymentProcessComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentStep, setPaymentStep] = useState("select");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardCompany: "",
  });

  // 로그인 정보 가져오기
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // 결제 수단 선택 핸들러 추가
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    // 로그인 체크
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    // 주문 정보 체크
    if (!orderData) {
      alert("주문 정보가 없습니다.");
      navigate(-1);
      return;
    }
  }, [auth, orderData, navigate]);

  const processPayment = async (paymentData) => {
    try {
      // 1. 결제 정보 생성
      const paymentInfo = {
        orderId: orderData.orderId,
        memberId: auth.user.id,
        amount: orderData.totalAmount,
        paymentMethod: paymentMethod,
        cardNumber: paymentData.cardNumber, // 카드 결제시
        cardCompany: paymentData.cardCompany, // 카드 결제시
        status: "PENDING",
      };

      // 2. 결제 요청
      const response = await paymentApi.processPayment(paymentInfo);

      // 결제 상태 확인
      const paymentStatus = await paymentApi.pollPaymentStatus(response.id);

      if (paymentStatus.status === "COMPLETE") {
        return response;
      } else {
        throw new Error(paymentStatus.errorMessage || "결제 처리 실패");
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      navigate("/payments/fail", {
        state: {
          error: error.message,
          orderInfo: orderData,
        },
      });
      throw error;
    }
  };

  const handlePaymentProcess = async () => {
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    try {
      setPaymentStep("process");

      // 결제 요청 데이터 구성
      const paymentData = {
        orderId: orderData.orderId,
        memberId: auth.user.id,
        amount: orderData.totalAmount,
        paymentMethod: paymentMethod,
        status: "PENDING",
      };

      if (paymentMethod === "card") {
        paymentData.cardNumber = cardInfo.cardNumber;
        paymentData.cardCompany = cardInfo.cardCompany;
      }

      // 1. 결제 처리 요청
      const paymentResult = await paymentApi.processPayment(paymentData);

      if (paymentResult.status === "COMPLETE") {
        // 2. 결제 완료 페이지로 이동
        navigate("/payments/complete", {
          state: {
            orderInfo: orderData,
            paymentInfo: paymentResult,
          },
        });
      } else {
        throw new Error(paymentResult.message || "결제 처리 실패");
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      navigate("/payments/fail", {
        state: {
          error: error.message,
          orderInfo: orderData,
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {paymentStep === "select" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">결제 수단 선택</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="card"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => handlePaymentMethodSelect("card")}
              />
              <label htmlFor="card">신용/체크카드</label>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="transfer"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={() => handlePaymentMethodSelect("transfer")}
              />
              <label htmlFor="transfer">계좌이체</label>
            </div>

            {/* 다른 결제 수단들 */}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">결제 금액</h3>
            <p className="text-xl">
              ₩{orderData?.totalAmount?.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handlePaymentProcess}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            결제하기
          </button>
        </div>
      )}

      {paymentStep === "process" && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-4">결제 처리 중</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessComponent;
