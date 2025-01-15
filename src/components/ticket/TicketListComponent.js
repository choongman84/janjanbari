import React, { useEffect, useState } from "react";
import { getAllTickets, fetchReservedSeats, getCurrentGameId } from "../api/ticketApi";
import { Link, useNavigate } from "react-router-dom";
import { axios } from 'axios';


const TicketListComponent = () => {
  const[matches,setMatches] = useState([]);
  const[selectedMonth,setSelectedMonth] = useState(new Date);
  const [tickets, setTickets] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("awayTeam");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [gameStatuses, setGameStatuses] = useState([]);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("auth");
  // console.log("티켓 목록의 사용자 : ", JSON.parse(storedUser));
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  console.log("ticket add parsetUser:", parsedUser);
  const { user } = parsedUser;
  console.log("user:", user);
  const [accessToken, setAccessToken] = useState(parsedUser.accessToken)
  useEffect(() => {
    // const res = getCurrentGameId();
    // console.log("res", res);
    fetchTickets();
  }, [page, size]);

  // useEffect(()=>{
  //   axios.get('/api/matches')
  //   .then(response =>{setMatches(response.Date);
  //   })
  //   .catch(error => { 
  //     console.error('일치하는 경기 일정이 없습니다:', error); 
  //     });
  // },[]);


  const fetchTickets = async () => {
    try {
      const data = await getAllTickets();
      console.log("Fetched tickets data:", data);
      setTickets(data);

      // Fetch the max game ID from the backend
      const backendMaxGameId = await getCurrentGameId();

      // Fetch statuses for all games up to backendMaxGameId
      const gameStatuses = await Promise.all(
        Array.from({ length: backendMaxGameId }, (_, index) => index + 1).map(async (gameId) => {
          const seats = await fetchReservedSeats(gameId, user.id, accessToken);
          return {
            gameId,
            isFullyReserved: seats.isFullyReserved,
          };
        })
      );

      setGameStatuses(gameStatuses);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };


  const handleNavigateToGameId = async (gameId) => {
    console.log("gamedID: ", gameId, user);
    try {
      const seats = await fetchReservedSeats(gameId, user.id);

     
      if (seats.isFullyReserved) {
        console.log(`Game ${gameId} is fully reserved.`);
      }

      // Navigate to the current gameId as clicked
      navigate(`/ticket/reserved-seats/${gameId}`);
    } catch (error) {
      console.error("Error navigating to gameId:", error);
      alert("Failed to fetch game status.");
    }
  };

  const matchDates = [
    "12월 1일 일요일 오후 4시 15분", // Game 1
    "12월 8일 월요일 오후 5시 00분", // Game 2
    "12월 15일 수요일 오후 3시 30분", // Game 3
    "12월 22일 토요일 오후 6시 00분", // Game 4
  ];

  return (
    <div className="p-4">

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-bold">구단 공지</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>- 전 좌석 지정좌석제로 운영합니다.</li>
          <li>- 온라인 예매 및 현장에서도 티켓 구매가 가능합니다.</li>
          <li>- 경기장내 음식물 반입 및 섭취가능(단,캔,병,페트병600ml이상 반입금지)</li>
          <li>- 경기 당일 원활한 입장을 위해 모바일 티켓을 적극 이용해 주시기 바랍니다. (1매표소 매우 혼잡합니다.)</li>
          <li>- 티켓북 구매 고객도 온라인 예매를 통한 티켓 구매후 입장이 가능합니다.</li>
        </ul>
      </div>

      <div className="flex items-center mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="awayTeam">어웨이 팀</option>
          <option value="memberName">구매자</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => { }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      {/* 게임별 조회 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">게임별 조회</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, index) => index + 1).map((gameId) => {
            const gameStatus = gameStatuses.find((status) => status.gameId === gameId);
            const isFullyReserved = gameStatus?.isFullyReserved ?? false;

            const awayTeams = [
              { name: "Liverpool", logo: "/images/my/LiverPool.jpg" },
              { name: "Chelsea", logo: "/images/my/Chelsea.png" },
              { name: "Arsenal", logo: "/images/my/Arsenal.png" },
            ];
            const awayTeam = awayTeams[(gameId - 1) % awayTeams.length];

            return (
              <div
                key={gameId}
                onClick={() => !isFullyReserved && handleNavigateToGameId(gameId)}
                className={`bg-white rounded-lg shadow-lg p-6 transform transition-all hover:scale-105 ${isFullyReserved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
              >
                {/* 상단 팀 로고와 매칭 정보 */}
                <div className="flex justify-between items-center mb-4 bg-indigo-950 rounded-lg p-4 shadow">
                  {/* 홈 팀 */}
                  <div className="flex items-center space-x-4">
                    <img
                      src="/images/real.jpg"
                      alt="Home Team"
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                    />
                    <span className="text-sm font-semibold text-white">Real Madrid</span>
                  </div>

                  {/* VS 텍스트 */}
                  <div className="text-lg font-bold text-white">VS</div>

                  {/* 원정 팀 */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-white">{awayTeam.name}</span>
                    <img
                      src={awayTeam.logo}
                      alt="Away Team"
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                    />
                  </div>
                </div>

                {/* 마이페이지 예약 티켓 조회 */}
                {/* 경기 정보 */}
                <div className="text-gray-700">
                  <div className="text-sm text-gray-500">리그</div>
                  <div className="text-lg font-bold mb-1">Game {gameId}</div>
                  <div className="text-sm mb-2">{matchDates[gameId - 1]}</div>
                  <div className="text-sm mb-2">산티아고 베르나베우</div>
                  <div className="text-sm text-indigo-600 font-semibold">VIP €295부터</div>
                </div>

                {/* 버튼 */}
                <button
                  className={`w-full mt-4 py-2 rounded-lg text-white font-semibold ${isFullyReserved
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  disabled={isFullyReserved}
                >
                  {isFullyReserved ? "매진" : "티켓 구매"}
                </button>
              </div>
            );
          })}
        </div>
      </div>


      <h2>티켓 목록</h2>
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold">ID</th>
            <th className="p-4 text-left text-sm font-semibold">회원 이름</th>
            <th className="p-4 text-left text-sm font-semibold">원정팀</th>
            <th className="p-4 text-left text-sm font-semibold">좌석 번호</th>
            <th className="p-4 text-left text-sm font-semibold">좌석 상태</th>
            <th className="p-4 text-left text-sm font-semibold">좌석 등급</th>
            <th className="p-4 text-center text-sm font-semibold">상세보기</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {/* 경기 내용 */}
          {(tickets || []).map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-blue-50 transition duration-150 ease-in-out"
            >
              <td className="p-4 text-center text-sm font-bold text-gray-800">
                {ticket.id}
              </td>
              <td className="p-4 text-left text-sm text-gray-700">
                {ticket.memberName || "N/A"}
              </td>
              <td className="p-4 text-left text-sm text-gray-700">
                {ticket.awayTeam || "N/A"}
              </td>
              <td className="p-4 text-left text-sm text-gray-700">
                {ticket.seatNumbers ? ticket.seatNumbers.join(", ") : "N/A"}
              </td>
              <td className="p-4 text-left text-sm font-semibold text-gray-800">
                {ticket.seatStatus}
              </td>
              <td className="p-4 text-left text-sm text-gray-700">
                {ticket.seatGrade || "N/A"}
              </td>
              <td className="p-4 text-center">
                <Link
                  to={`/ticket/${ticket.id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                >
                  조회
                </Link>
              </td>
            </tr>
          ))}
        </tbody>


      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          이전
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TicketListComponent;
