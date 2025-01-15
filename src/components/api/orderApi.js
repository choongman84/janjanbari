import jwtAxios from "../../util/jwtUtil";

const API_SERVER_HOST =
  window.REACT_APP_API_BASE_URL || "http://localhost:8080";
const BASE_URL = `${API_SERVER_HOST}/api/orders`;

// 단일 상품 주문
export const createOrderFromKit = async (memberId, kitId, orderData) => {
  try {
    console.log("단일 상품 주문 요청 데이터:", {
      memberId,
      kitId,
      orderData,
    });

    // OrderDTO 구조에 맞게 데이터 변환
    const requestData = {
      receiver: orderData.receiver,
      receiverPhone: orderData.receiverPhone,
      address: {
        address: orderData.address.address, // 수정: 중첩 객체 구조로 변경
        detailAddress: orderData.address.detailAddress, // 수정: 중첩 객체 구조로 변경
        zipcode: orderData.address.zipcode, // 수정: 중첩 객체 구조로 변경
      },
      deliveryMessage: orderData.deliveryMessage || "",
      totalAmount: orderData.totalAmount,
      orderItems: [
        {
          kitId: kitId,
          selectedSize: orderData.orderItems[0].selectedSize,
          quantity: orderData.orderItems[0].quantity,
          basePrice: orderData.orderItems[0].basePrice,
          customization: orderData.orderItems[0].customization,
        },
      ],
    };

    console.log("변환된 요청 데이터:", requestData);

    const response = await jwtAxios.post(
      `${BASE_URL}/${memberId}/kits/${kitId}`,
      requestData
    );

    console.log("주문 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("단일 상품 주문 실패:", error);
    throw error;
  }
};

// 장바구니 주문
export const createOrderFromCart = async (memberId, orderData) => {
  try {
    console.log("장바구니 주문 요청 데이터:", {
      memberId,
      orderData,
    });

    // OrderDTO 구조에 맞게 데이터 변환
    const requestData = {
      receiver: orderData.receiver,
      receiverPhone: orderData.receiverPhone,
      address: {
        address: orderData.address, // 변경: 문자열 값 사용
        detailAddress: orderData.addressDetail, // 변경: 문자열 값 사용
        zipcode: orderData.zipcode, // 변경: 문자열 값 사용
      },
      deliveryMessage: orderData.message || "",
      totalAmount: orderData.totalAmount,
      orderItems: orderData.orderItems.map((item) => ({
        kitId: item.kitId,
        selectedSize: item.size,
        quantity: item.quantity || 1,
        basePrice: item.basePrice,
        customization: item.customization,
      })),
    };

    console.log("변환된 요청 데이터:", requestData);

    const response = await jwtAxios.post(
      `${BASE_URL}/${memberId}/cart`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("auth")
              ? JSON.parse(localStorage.getItem("auth")).accessToken
              : null
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("주문 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("장바구니 주문 실패:", error);
    console.error("에러 상세:", error.response?.data);
    throw error;
  }
};

// 주문 상세 조회
export const getOrderDetail = async (memberId, orderId) => {
  try {
    const response = await jwtAxios.get(
      `${BASE_URL}/${memberId}/orders/${orderId}`,
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

    // 주문 생성 성공 후 결제 페이지로 이동하기 위한 데이터 준비
    return {
      success: true,
      orderData: response.data,
    };
  } catch (error) {
    console.error("주문 상세 조회 실패:", error);
    throw error;
  }
};

// 주문 목록 조회
export const getOrderList = async (memberId) => {
  try {
    const response = await jwtAxios.get(`${BASE_URL}/${memberId}`, {
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
    console.error("주문 목록 조회 실패:", error);
    throw error;
  }
};

// 주문 취소
export const cancelOrder = async (memberId, orderId) => {
  try {
    const response = await jwtAxios.post(
      `${BASE_URL}/${memberId}/orders/${orderId}/cancel`,
      {},
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
    console.error("주문 취소 실패:", error);
    throw error;
  }
};
