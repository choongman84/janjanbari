import React, { useEffect, useState } from "react";
import { createTicket, fetchReservedSeats, reserveSeats } from "../api/ticketApi"; // API calls
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./TicketAdd.css";

const TicketAddComponent = () => {
  const navigate = useNavigate();
  const { gameId } = useParams()
  const storedUser = localStorage.getItem("auth");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  // console.log("티켓 목록의 사용자 : ", JSON.parse(storedUser));
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  console.log("ticket add parsetUser:", parsedUser);
  const { user } = parsedUser;
  console.log("user:", user);
  const [accessToken, setAccessToken] = useState(parsedUser.accessToken)
  // const [user, setUser] = useState(parsedUser)
  const [reservedSeats, setReservedSeats] = useState([]); // Reserved seat data
  const seatRows = ["A", "B", "C", "D"]; // Seat rows
  const seatGrades = ["REGULAR", "VIP"]; // Seat grades
  const seatPrices = { REGULAR: 500, VIP: 1500 }; // Pricing for each grade
  const awayTeams = ["BARCELONA", "레알마드리드", "현대"]; // Away teams
  const [selectedSeats, setSelectedSeats] = useState([]); // Selected seats
  const [ticketData, setTicketData] = useState({
    awayTeam: awayTeams[0],
    memberId: user.id,
    ticketDate: new Date().toISOString().split("T")[0],
    price: 0,
    gameId: 1,
    // seatNumbers: [],
    seatGrade: [],
    status: "AVAILABLE",
  });


  const handleNavigation = async () => {
    if (!isNavigating && !isLoading) {
      setIsNavigating(true);
      setIsLoading(true); // 로딩 상태 활성화

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 예시: 네트워크 요청 대기
        navigate("/ticket/detailList");
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 비활성화
        setIsNavigating(false);
      }
    }
  };

  const fetchSeatStatus = async (gameId) => {
    try {
      const response = await fetchReservedSeats(gameId, user.id, accessToken); // Fetch from the API
      const { reservedSeats } = response || {}; // Destructure reservedSeats
      if (Array.isArray(reservedSeats)) {
        setReservedSeats(reservedSeats); // Set reserved seats if valid
      } else {
        setReservedSeats([]); // Fallback to an empty array if invalid
      }
    } catch (error) {
      console.error("Error fetching seat status:", error);
      setReservedSeats([]); // Fallback to empty array on error
    }
  };


  useEffect(() => {
    if (gameId) {
      console.log("gameId: 호출 777");
      fetchSeatStatus(gameId)
      setTicketData((prev) => ({ ...prev, gameId }));
    }
    else {
      // gameId가 없는 경우 처리
      (async () => {
        const defaultGameId = 1; // 기본값 설정
        const dataToSend = {
          ...ticketData,
          gameId: defaultGameId,
          rows: [], // 기본 값
          numbers: [], // 기본 값
          seatGrade: [], // 기본 값
          selectedSeats: [], // 기본 값
        };

        try {     // 기본 게임 ID로 좌석 예약 요청
          const response = await fetch(
            `http://localhost:8080/api/ticket/reserve-seats/1`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataToSend),
            }
          );

          if (response.ok) {
            navigate(`/ticket/add/${defaultGameId}`); // 새로운 gameId 페이지로 이동
          } else {
            const errorData = await response.json();
            console.error("Error creating default gameId:", errorData);
          }
        } catch (error) {
          console.error("Error sending request:", error);
        }
      })();
    }
  }, [gameId]);

  const toggleSeatGrade = (row, number) => {
    const seatKey = `${row}${number}`;

    setSelectedSeats((prevSeats) => {
      const existingSeat = prevSeats.find((seat) => seat.key === seatKey);
      let updatedSeats;

      if (existingSeat) {
        // Toggle between VIP and REGULAR
        const nextGrade = existingSeat.grade === "VIP" ? "REGULAR" : "VIP";
        updatedSeats = prevSeats.map((seat) =>
          seat.key === seatKey ? { ...seat, grade: nextGrade } : seat
        );
      } else {
        // Add a new seat with default grade REGULAR
        updatedSeats = [
          ...prevSeats,
          { key: seatKey, grade: "REGULAR", row, number }, // Default grade
        ];
      }

      // Update ticketData with the new seats and calculate the total price
      const rows = updatedSeats.map((seat) => seat.row);
      const numbers = updatedSeats.map((seat) => seat.number);
      const seatGrades = updatedSeats.map((seat) => seat.grade);

      setTicketData((prev) => ({
        ...prev,
        rows,
        numbers,
        seatGrade: seatGrades,
        price: updatedSeats.reduce(
          (total, seat) => total + seatPrices[seat.grade],
          0
        ),
      }));

      return updatedSeats;
    });
  };

  // 선택된 좌석을 삭제하는 함수
  const removeSeat = (seatKey) => {
    setSelectedSeats((prevSeats) => {
      const updatedSeats = prevSeats.filter((seat) => seat.key !== seatKey);

      // Update the total price
      updatePrice(updatedSeats);

      return updatedSeats;
    });
  };

  // 선택된 좌석의 가격을 계산하는 함수
  const updatePrice = (seats) => {
    const totalPrice = seats.reduce(
      (acc, seat) => acc + seatPrices[seat.grade],
      0
    );
    setTicketData((prevData) => ({
      ...prevData,
      price: totalPrice,
      seatNumbers: seats.map((seat) => Number(seat.key)), // 선택된 좌석 번호
      seatGrade: seats.length ? seats[0].grade : null,
    }));
  };
  const handleSubmit = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Map selected seats to include row, number, and grade
    const seatsToReserve = selectedSeats.map((seat) => ({
      row: seat.row, // Row of the seat
      number: seat.number, // Seat number
      grade: seat.grade, // Ensure grade is included
      seatInfo: `${seat.row}${seat.number}`, // Combine row and number for seatInfo
    }));

    // Prepare the payload
    const dataToSend = {
      ...ticketData,
      selectedSeats: seatsToReserve, // Include processed seats
    };

    console.log("Data to send:", JSON.stringify(dataToSend, null, 2)); // Log the payload for debugging

    try {
      // Call the API with the token
      await reserveSeats(ticketData.gameId, dataToSend, accessToken);

      alert("Seats successfully reserved!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error reserving seats:", error);
      alert("좌석 예약 오류.");
    }
  };

  // 좌석이 예약되었는지 확인하는 함수
  const isSeatReserved = (row, number) => {
    // Ensure reservedSeats is always an array
    if (!Array.isArray(reservedSeats)) {
      console.warn("reservedSeats is not an array:", reservedSeats);
      return false;
    }

    // 예약된 좌석인지 확인
    return reservedSeats.some(
      (seat) =>
        seat.row === row &&
        seat.number === parseInt(number, 10) &&
        seat.status === "RESERVED"
    );
  };

  const renderSeatButton = (row, number) => {
    const seatKey = `${row}${number}`;
    const isReserved = isSeatReserved(row, number);
    const isSelected = selectedSeats.some((seat) => seat.key === seatKey);
    const seatGrade = isSelected
      ? selectedSeats.find((seat) => seat.key === seatKey).grade
      : null;

    // 좌석 기본 배경색 설정
    const getSectionBackgroundColor = (row) => {
      switch (row) {
        case 'H':
        case 'G':
          return 'bg-red-400';
        case 'D':
        case 'E':
        case 'F':
          return 'bg-yellow-200';
        case 'C':
          return 'bg-green-700';
        case 'A':
        case 'B':
          return 'bg-red-400';
        default:
          return 'bg-gray-200';
      }
    };

    return (
      <div className="relative w-full">
        <button
          key={seatKey}
          onClick={() => !isReserved && toggleSeatGrade(row, number)}
          className={`seat-button w-full h-16 flex flex-col justify-center items-center ${isReserved
            ? "bg-gray-500 cursor-not-allowed"
            : isSelected
              ? seatGrade === "VIP"
                ? "bg-yellow-400"
                : "bg-blue-400"
              : getSectionBackgroundColor(row)
            }`}
          disabled={isReserved}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <span className="text-sm">{seatKey}</span>
            {isSelected && <span className="text-xs">{seatGrade}</span>}
          </div>
        </button>
        {isSelected && (
          <button
            onClick={() => removeSeat(seatKey)}
            className="delete-button absolute items-center justify-center"
          >
            <FaTrash className="text-red-500 text-xl" />
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* 좌석 선택 영역 */}
      <div className="flex-2 p-6 overflow-auto">
        <h2 className="text-center mb-4 text-lg font-bold">원하는 좌석을 클릭해주세요</h2>

        {/* VIP 구역 */}
        <div className="grid grid-cols-11 gap-4 items-center mb-4">
          {/* 왼쪽 G석 */}
          <div className="col-span-5 grid grid-cols-5 gap-1">
            {["H5", "H4", "H3", "H2", "H1"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>

          {/* 중앙 VIP 석 */}
          <div className="col-span-1 flex flex-col items-center w-30 h-30 justify-center bg-fuchsia-400 rounded-lg p-2">
            <div>중앙석</div>
            <div>VIP</div>
            <div>응원석</div>
          </div>

          {/* 오른쪽 G석 */}
          <div className="col-span-5 grid grid-cols-5 gap-1">
            {["G5", "G4", "G3", "G2", "G1"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>
        </div>

        {/* W석 */}
        <div className="grid grid-cols-10 gap-4 mb-4">
          {["B5", "B4", "B3", "B2", "B1", "A5", "A4", "A3", "A2", "A1"].map(
            (section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            }
          )}
        </div>

        {/* C석과 경기장 */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 mb-4">
          <div className="grid grid-rows-6 gap-1 w-20">
            {["C1", "C2", "C3", "C4", "C5", "C6"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>

          {/* 경기장 */}
          <div className="relative aspect-[2/1] bg-green-600 rounded-lg m-3 mt-1 overflow-x">
            <div className="absolute inset-0 border-2 border-white rounded-lg m-4">
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2" />
              <div className="absolute top-1/4 left-0 w-1/6 h-1/2 border-2 border-l-0 border-white" />
              <div className="absolute top-1/4 right-0 w-1/6 h-1/2 border-2 border-r-0 border-white" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/real.jpg?height=120&width=120"
                alt="구단 로고"
                className="w-32 h-32"
              />
            </div>
          </div>

          <div className="grid grid-rows-6 gap-1 w-20">
            {["F6", "F5", "F4", "F3", "F2", "F1"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>
        </div>

        {/* 하단 좌석 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-5 gap-1">
            {["D1", "D2", "D3", "D4", "D5"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {["E1", "E2", "E3", "E4", "E5"].map((section) => {
              const row = section[0];
              const number = section.slice(1);
              return renderSeatButton(row, number);
            })}
          </div>
        </div>

        {/* 범례 */}
        <div className="flex gap-4  justify-center mt-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400" />
            <span>W석</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200" />
            <span>E/N석</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-700" />
            <span>원정석</span>
          </div>
        </div>
      </div>

      {/* 선택된 좌석 정보 */}
      <div className="flex-1 p-5 border-l-2 border-gray-400 overflow-auto">
        <h3 className="text-xl mb-4">선택된 좌석</h3>
        <ul className="space-y-2">
          {selectedSeats.map((seat) => (
            <li key={seat.key}>
              {seat.key} - {seat.grade} - {seatPrices[seat.grade]}원
            </li>
          ))}
        </ul>
        <div className="text-lg font-bold mt-4">
          총 금액: {ticketData.price}원
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:brightness-110"
            onClick={handleSubmit}
          >
            예약하기
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:brightness-110"
            onClick={() => {
              setSelectedSeats([]);
              updatePrice([]);
            }}
          >
            전체 취소
          </button>
          <button
            type="button"
            className={`bg-gray-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:brightness-110 ${isNavigating || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleNavigation}
            disabled={isNavigating || isLoading}
          >
            {isLoading ? "로딩 중..." : "티켓조회"}
          </button>

        </div>


      </div>
    </div>
  );
};

export default TicketAddComponent;