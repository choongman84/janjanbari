import jwtAxios from "../../util/jwtUtil";

const API_SERVER_HOST =
  window.REACT_APP_API_BASE_URL || "http://localhost:8080";
const BASE_URL = `${API_SERVER_HOST}/api/payments`;

export const processPayment = async (orderData, paymentMethod) => {
  try {
    const paymentData = {
      orderId: orderData.orderId,
      memberId: orderData.memberId,
      amount: orderData.totalAmount,
      paymentMethod: paymentMethod,
      status: "PENDING",
    };

    const response = await jwtAxios.post(`${BASE_URL}/process`, paymentData, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("결제 처리 실패:", error);
    throw error;
  }
};

export const cancelPayment = async (paymentId) => {
  try {
    const response = await jwtAxios.post(
      `${BASE_URL}/cancel/${paymentId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("auth")
              ? JSON.parse(localStorage.getItem("auth")).accessToken
              : null
          }`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("결제 취소 실패:", error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await jwtAxios.get(`${BASE_URL}/status/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("결제 상태 조회 실패:", error);
    throw error;
  }
};

export const getMemberPayments = async (memberId) => {
  try {
    const response = await jwtAxios.get(`${BASE_URL}/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("회원 결제 내역 조회 실패:", error);
    throw error;
  }
};

// 결제 상태 조회 주기적 체크
export const pollPaymentStatus = async (paymentId, maxAttempts = 10) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await getPaymentStatus(paymentId);

      if (response.status === "COMPLETE") {
        return response;
      } else if (response.status === "FAILED") {
        throw new Error(response.errorMessage || "결제 실패");
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("결제 상태 확인 실패:", error);
      throw error;
    }
  }

  throw new Error("결제 시간 초과");
};

// 결제 취소 요청
export const requestPaymentCancel = async (paymentId, reason) => {
  try {
    const response = await jwtAxios.post(
      `${BASE_URL}/cancel/${paymentId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("auth")
              ? JSON.parse(localStorage.getItem("auth")).accessToken
              : null
          }`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("결제 취소 요청 실패:", error);
    throw error;
  }
};

// 결제 상태 업데이트
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await jwtAxios.patch(
      `${BASE_URL}/${paymentId}/status`,
      status, // 문자열로 직접 전송
      {
        headers: {
          "Content-Type": "text/plain", // 컨텐츠 타입을 text/plain으로 변경
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("결제 상태 업데이트 실패:", error);
    throw error;
  }
};
