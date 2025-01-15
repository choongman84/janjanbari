import jwtAxios from "../../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/board`;

// 모든 보드 게시판을 가져옵니다.
export const getList = async (token) => {
  console.log("여기는 getlist 호출");
  try {
    const res = await jwtAxios.get(`${host}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res.data; 
  } catch (error) {
    console.error("Error fetching board list:", error.response?.data || error.message);
    throw error;
  }
};

//새 게시물 등록하기
export const register = async (boardData, token) => {
  console.log("여기는 register 호출", boardData, token);
  try {
    const res = await jwtAxios.post(`${host}/create`, boardData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};

// ID로 게시판 게시물 가져오기
export const getBoardById = async (bno, token) => {
  try {
    console.log("Fetching board with ID:", bno);
    const res = await jwtAxios.get(`${host}/list/${bno}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Board data received:", res.data);
    return res.data;
  } catch (error) {
    console.error("게시글 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 게시판 게시물 업데이트
export const updateBoard = async (bno, boardData, token) => {
  console.log("여기는 updateBoard 호출");
  try {
    const res = await jwtAxios.put(`${host}/modify/${bno}`, boardData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Updated board data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to update board data:", error.response?.data || error.message);
    throw error;
  }
};

// 삭제
export const deleteBoard = async (bno, token) => {
  try {
    const res = await jwtAxios.delete(`${host}/delete/${bno}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Board deleted:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to delete board:", error.response?.data || error.message);
    throw error;
  }
};

// 검색
export const searchBoard = async (page, size, type, keyword, token) => {
  console.log("boardsearch:", page, size, type, keyword);
  try {
    const res = await jwtAxios.get(`${host}/list/search`, {
      params: {
        page: page,
        size: size,
        type: type,
        keyword: keyword,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data; // GymPageDTO 객체 리턴
  } catch (error) {
    console.error("검색 API 오류:", error.response?.data || error.message);
    throw error;
  }
};
