import jwtAxios from "../../util/jwtUtil";

window.REACT_APP_API_BASE_URL = "http://localhost:8080";

const API_SERVER_HOST =
  window.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

const BASE_URL = `${API_SERVER_HOST}/api/wishlist`;

// 위시리스트 추가 
export const addWishlist = async (memberId, kitId) => {
  try {
    const response = await jwtAxios.post(`${BASE_URL}/${memberId}/${kitId}`, null, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
    
    if (!response.data) throw new Error("응답 데이터가 없습니다.");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("로그인이 필요한 서비스입니다.");
    }
    throw new Error(error.response?.data || "위시리스트 처리 중 오류가 발생했습니다.");
  }
};

// 위시리스트 제거
export const removeWishlist = async (memberId, kitId) => {
  try {
    await jwtAxios.delete(`${BASE_URL}/${memberId}/${kitId}`, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
  } catch (e) {
    throw new Error(e.response?.data || "위시리스트 제거 중 오류 발생");
  }
};

// 위시리스트 상태 확인
export const checkWishlist = async (memberId, kitId) => {
  try {
    const response = await jwtAxios.get(`${BASE_URL}/${memberId}/check/${kitId}`, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).accessToken
            : null
        }`,
      },
    });
    return response.data;
  } catch (e) {
    console.error("위시리스트 체크 실패", e);
    return false;
  }
};

// 사용자의 위시리스트 조회
export const getWishlist = async (memberId) => {
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
  } catch (e) {
    console.error("위시리스트 조회 실패", e);
    throw e;
  }
};