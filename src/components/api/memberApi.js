import axios from "axios";
import { setCookie } from "../../util/cookieUtil";
import jwtAxios from "../../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const API_URL = `${API_SERVER_HOST}/api/members`;

export const loginPost = async (loginData) => {
  try {
    console.log("Sending Login Data:", loginData);
    // const res = await axios.post(`http://localhost:8080/api/members/login`, loginData);
    // const { accessToken, refreshToken } = res.data;
    // setCookie('member', JSON.stringify({ accessToken, refreshToken }), 1);
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/members/login`, loginData);
    console.log("Login API Response Data:", response.data);
    return response.data; // Ensure backend returns valid JSON
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};



export const signup = async (signupData) => {
  try {
    const response = await jwtAxios.post(`${API_URL}/signup`, signupData);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchMyPageList = async (memberId) => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/member/mypage`, {
      params: { memberId }, // Pass memberId as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch MyPage list:", error.response?.data || error.message);
    throw error;
  }
};

export const getMemberInfo = async (memberId) => {
  try {
     console.log("회원 정보 조회 요청:", memberId);
    const response = await jwtAxios.get(
      `${API_SERVER_HOST}/api/members/${memberId}`
    );
    console.log("회원 정보 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 정보 조회 실패:", error);
    throw error;
  }
};
