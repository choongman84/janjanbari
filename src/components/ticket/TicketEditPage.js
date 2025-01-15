import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketById, updateTicket } from "../api/ticketApi";
import { FaTrash } from "react-icons/fa";
// 티켓 수정 페이지
const TicketEditPage = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  const [ticketData, setTicketData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("auth");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const { accessToken } = parsedUser || {};

  const seatPrices = { REGULAR: 500, VIP: 1500 };
  const seatsPerRow = { A: 5, B: 5, C: 6, D: 5, E: 5, F: 6, G: 5, H: 5 };

  // Fetch ticket details and reserved seats
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await getTicketById(ticketId, 1, accessToken);
        console.log("Fetched ticket data:", response);

        const { ticketDTO, seatDTO } = response || {};
        setTicketData(ticketDTO);
        setSeats(seatDTO || []);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId, accessToken]);

  const toggleSeatGrade = (row, number) => {
    const seatKey = `${row}${number}`;

    setSeats((prevSeats) => {
      const existingSeat = prevSeats.find(
        (seat) => seat.row === row && seat.number === number
      );

      if (existingSeat) {
        return prevSeats.map((seat) =>
          seat.row === row && seat.number === number
            ? {
              ...seat,
              grade: seat.grade === "VIP" ? "REGULAR" : "VIP",
              status: "RESERVED", // 상태 유지
            }
            : seat
        );
      } else {
        return [
          ...prevSeats,
          {
            row,
            number,
            grade: "REGULAR", // 기본 등급
            status: "RESERVED", // 기본 상태는 RESERVED
            seatInfo: seatKey,
          },
        ];
      }
    });
  };

  const removeSeat = (row, number) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.row === row && seat.number === number
          ? { ...seat, status: "AVAILABLE" } // 좌석 상태를 AVAILABLE로 변경
          : seat
      )
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return seats
      .filter((seat) => seat.status === "RESERVED") // Only include reserved seats
      .reduce((total, seat) => {
        return total + seatPrices[seat.grade];
      }, 0);
  };

  const handleSave = async () => {
    if (seats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const updatedTicket = {
      ...ticketData,
      selectedSeats: seats, // 모든 좌석 데이터를 전달
      price: calculateTotalPrice(),
    };

    console.log("Updated Ticket Payload:", updatedTicket);

    try {
      await updateTicket(ticketId, 1, updatedTicket, accessToken);
      alert("Ticket updated successfully!");
      navigate("/ticket/detailList");
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update the ticket.");
    }
  };

  // Render seat button
  const renderSeatButton = (row, number) => {
    const seatKey = `${row}${number}`;
    const existingSeat = seats.find(
      (seat) => seat.row === row && seat.number === number
    );

    const isReserved = existingSeat?.status === "RESERVED";
    const isAvailable = existingSeat?.status === "AVAILABLE";
    const seatGrade = existingSeat?.grade;

    return (
      <div className="relative w-full" key={seatKey}>
        <button
          onClick={() => toggleSeatGrade(row, number)}
          className={`seat-button w-full h-16 flex flex-col justify-center items-center ${isReserved
            ? seatGrade === "VIP"
              ? "bg-yellow-400"
              : "bg-blue-400"
            : isAvailable
              ? "bg-gray-200"
              : "bg-gray-200"
            }`}
          disabled={isAvailable} // Disable if status is AVAILABLE
        >
          <div className="w-full flex flex-col items-center justify-center">
            <span className="text-sm">{seatKey}</span>
            {isReserved && <span className="text-xs">{seatGrade}</span>}
          </div>
        </button>
        {isReserved && (
          <button
            onClick={() => removeSeat(row, number)}
            className="delete-button absolute items-center justify-center"
          >
            <FaTrash className="text-red-500 text-xl" />
          </button>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <div className="flex-2 p-6 overflow-auto">
        <h2 className="text-center mb-4 text-lg font-bold">좌석 선택</h2>
        {Object.entries(seatsPerRow).map(([row, seatCount]) => (
          <div key={row} className="grid grid-cols-6 gap-2 mb-4">
            {[...Array(seatCount).keys()].map((number) =>
              renderSeatButton(row, number + 1)
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 p-5 border-l-2 border-gray-400 overflow-auto">
        <h3 className="text-xl mb-4">선택된 좌석</h3>
        <ul className="space-y-2">
          {seats
            .filter((seat) => seat.status === "RESERVED")
            .map((seat) => (
              <li key={`${seat.row}${seat.number}`}>
                {seat.seatInfo} - {seat.grade} - ₩{seatPrices[seat.grade]}
                <button onClick={() => removeSeat(seat.row, seat.number)}>
                  <FaTrash className="text-red-500 ml-2" />
                </button>
              </li>
            ))}
        </ul>
        <div className="text-lg font-bold mt-4">
          총 금액: ₩{calculateTotalPrice()}
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:brightness-110"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default TicketEditPage;
