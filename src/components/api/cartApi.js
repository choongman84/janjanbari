import jwtAxios from "../../util/jwtUtil";
window.REACT_APP_API_BASE_URL = "http://localhost:8080";

const API_SERVER_HOST =
  window.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

const BASE_URL = `${API_SERVER_HOST}/api/cart`;

export const getCart = async (memberId) => {
    
  try {
      const response = await jwtAxios.get(`${BASE_URL}/${memberId}`, {
        
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
        },
      }
    );
    console.log("장바구니 조회 응답:", response.data);
    return response.data;
  } catch (e) {
    console.log("장바구니 조회 에러", e);
    throw e;
  }
};

export const addToCart = async (memberId, cartItem) => {
  try {
    console.log("장바구니 아이템 추가 요청:", cartItem);
    const response = await jwtAxios.post(
      `${BASE_URL}/${memberId}/items`,
      cartItem,
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
    console.error("장바구니 아이템 추가 실패:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (memberId, itemId, quantity) => {
  try {
    const response = await jwtAxios.patch(
      `${BASE_URL}/${memberId}/items/${itemId}/quantity`,
      { quantity }
    );
    return response.data;
  } catch (error) {
    console.error("수량 업데이트 실패:", error);
    throw error;
  }
};

export const removeCartItem = async (memberId, itemId) => {
  try {
    await jwtAxios.delete(`${BASE_URL}/${memberId}/items/${itemId}`);
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    throw error;
  }
};
