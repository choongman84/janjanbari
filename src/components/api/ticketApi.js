
import jwtAxios from "../../util/jwtUtil";


// 기본 API 구성
const API_SERVER_HOST = "http://localhost:8080";
const ticketHost = `${API_SERVER_HOST}/api/ticket`;

//  API 요청 시 사용되는 공통 헤더 설정 함수
const getHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});

// 티켓 목록을 가져오는 API 호출 함수
export const getAllTickets = async (token) => {
    try {
        const res = await jwtAxios.get(`${ticketHost}/list`, getHeaders(token));
        return res.data;
    } catch (error) {
        console.error("Error fetching tickets:", error.response?.data?.message || error.message);
        throw error;
    }
};
// 좌석 예약(티켓 생성)
export const createTicket = async (gameId, ticketData, token, onSeatsUpdated) => {
    console.log("ticket 99)");
    try {
        const response = await jwtAxios.post(
            `${ticketHost}/reserve-seats/${gameId}`,
            ticketData,
            getHeaders(token)
        );

        if (response.status === 200) {
            const { updatedSeats } = response.data;

            // Optional callback to update seat state in the UI
            if (onSeatsUpdated) onSeatsUpdated(updatedSeats);

            alert("Seats successfully reserved!");
        } else {
            alert("Error reserving seats. Please try again.");
        }
    } catch (error) {
        console.error("Error reserving seats:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Server error occurred.");
        throw error;
    }
};
// 업뎃 티켓 (수정)
export const updateTicket = async (ticketId, gameId, ticketData, token) => {
    console.log("ticketData 999:", ticketData);
    try {
        const res = await jwtAxios.put(
            `${ticketHost}/modify/${ticketId}`,
            ticketData,
            {
                ...getHeaders(token),
                params: { gameId }, // Add gameId as a query parameter
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating ticket:", error.response?.data?.message || error.message);
        throw error;
    }
};

// 삭제
export const deleteTicket = async (ticketId, token) => {
    try {
        const res = await jwtAxios.delete(`${ticketHost}/delete/${ticketId}`, getHeaders(token));
        return res.data;
    } catch (error) {
        console.error("Error deleting ticket:", error.response?.data?.message || error.message);
        throw error;
    }
};

// 페이지 및 필터가 있는 티켓 검색
export const searchReservations = async (page, size, type, keyword, token) => {
    try {
        const response = await jwtAxios.get(`${ticketHost}/search`, {
            params: { page, size, type, keyword },
            ...getHeaders(token),
        });
        return response.data;
    } catch (error) {
        console.error("Error searching tickets:", error.response?.data?.message || error.message);
        throw error;
    }
};

// 예약된 좌석 정보 가져오기
// 특정 게임과 사용자의 예약된 좌석 정보를 가져오는 GET 요청 함수
export const fetchReservedSeats = async (gameId, memberId, token) => {
    console.log("fetchReservedSeats:", gameId, memberId, token);
    if (!gameId || !memberId) {
        console.error("gameId and memberId are required and must be valid numbers.");
        throw new Error("gameId and memberId are required.");
    }

    try {
        const response = await jwtAxios.get(`${ticketHost}/reserved-seats/${gameId}`, {
            params: { memberId }, // memberId를 쿼리 파라미터로 전달
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching reserved seats:", error.response?.data?.message || error.message);
        throw error;
    }
};


// 현재 게임 ID 가져오기
// 가장 최신 게임의 ID를 가져오는 GET 요청 함수
export const getCurrentGameId = async (token) => {
    try {
        const response = await jwtAxios.get(`${ticketHost}/max`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching current game ID:", error.response?.data?.message || error.message);
        throw error;
    }
};
// 좌석 예약 API 호출 함수
export const reserveSeats = async (gameId, ticketData, token) => {
    console.log("reserveSeats called with:", gameId, ticketData, token);
    try {
        const response = await jwtAxios.post(
            `${ticketHost}/reserve-seats/${gameId}`, // API URL
            ticketData, // 요청 본문으로 ticketData 전달
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    "Content-Type": "application/json", // JSON 데이터임을 명시
                },
            }
        );

        console.log("Reservation success:", response.data); // 성공 로그
        return response.data;
    } catch (error) {
        console.error(
            "Error reserving seats:",
            error.response?.data?.message || error.message // 서버 응답 또는 일반 에러 메시지 출력
        );
        throw error; // 에러를 호출한 쪽으로 전달
    }
};
// 특정 티켓 ID에 대한 정보를 가져오는 GET 요청 함수
export const getTicketById = async (ticketId, gameId) => {
    try {
        const response = await jwtAxios.get(`/api/ticket/${ticketId}`, {
            params: { gameId }, // Add gameId as a query parameter
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching ticket by ID:",
            error.response?.data?.message || error.message
        );
        throw error;
    }
};
