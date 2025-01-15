import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";

const api = axios.create({
    baseURL: API_SERVER_HOST,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

// 요청 인터셉터 - JWT 토큰 추가 1202
api.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            const { token } = JSON.parse(auth);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리 1202
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth');
            window.location.href = '/members/login';
        } else if (error.response?.status === 403) {
            alert('접근 권한이 없습니다.');
        } else if (error.response?.status === 404) {
            alert('요청하신 페이지를 찾을 수 없습니다.');
        } else {
            alert('오류가 발생했습니다.');
        }
        return Promise.reject(error);
    }
)
export const getImageUrl = (imageName) => {
    if (!imageName) return "";

    if (imageName.startsWith("http") || imageName.startsWith("/images")) {
        return `${API_SERVER_HOST}${imageName}`;
    }

    const cleanFileName = imageName.replace("/images/", "");

    return `${API_SERVER_HOST}/images/${cleanFileName}`;
};

export default api;
