import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/comments`;

// 액세스 토큰을 검색하는 도우미 기능
const getAccessToken = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    console.error("Authentication token not found in localStorage");
    throw new Error("Authentication required");
  }

  const { accessToken } = JSON.parse(auth);
  if (!accessToken) {
    console.error("Access token is missing");
    throw new Error("Invalid token");
  }

  return accessToken;
};

// 댓글 추가
export const addComment = async (bno, commentData) => {
  console.log("Adding comment for board:", bno, commentData);
  const accessToken = getAccessToken();

  return await axios.post(`${host}/${bno}/comment`, commentData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

// 게시판 댓글 목록 가져오기
export const getCommentList = async (bno) => {
  console.log("Fetching comments for board ID:", bno);
  const accessToken = getAccessToken();

  try {
    const response = await axios.get(`${host}/board/${bno}/comments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Received comments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error.response?.data || error.message);
    throw error;
  }
};

// 댓글 업데이트
export const updateComment = (cno, commentData) => {
  console.log("Updating comment with ID:", cno, commentData);
  const accessToken = getAccessToken();

  return axios.put(`${host}/update/${cno}`, commentData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

//댓글 삭제
export const deleteComment = (cno) => {
  console.log("Deleting comment with ID:", cno);
  const accessToken = getAccessToken();

  return axios.delete(`${host}/delete/${cno}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

// 게시판 ID로 댓글 받기
export const getCommentsByBoardId = async (bno) => {
  try {
    const response = await axios.get(`${host}/board/${bno}/comments`);
    return response.data; // 댓글 데이터 반환
  } catch (error) {
    console.error("Failed to fetch comments:", error.response?.data || error.message);
    throw error;
  }
};
