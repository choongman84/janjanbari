import React, { useEffect, useState } from "react";
import { fetchTicketDetails, updateTicket } from "../api/ticketApi"; // API calls for fetching/updating ticket data
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./TicketAdd.css";
// 티켓 수정 컨포넌트
const TicketEditComponent = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams(); // Ticket ID from route parameters
  const [ticketData, setTicketData] = useState(null); // Store ticket details
  const [reservedSeats, setReservedSeats] = useState([]); // Reserved seats
  const [selectedSeats, setSelectedSeats] = useState([]); // User-selected seats
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const seatPrices = { REGULAR: 500, VIP: 1500 }; // Pricing
  const seatRows = ["A", "B", "C", "D", "E", "F"]; // Rows

  // Fetch ticket details and populate state
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetchTicketDetails(ticketId); // API call
        const { ticket, reservedSeats } = response;

        setTicketData(ticket); // Populate ticket data
        setReservedSeats(reservedSeats || []); // Populate reserved seat data
        setSelectedSeats(ticket.selectedSeats || []); // Populate selected seats
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        alert("Failed to load ticket details.");
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleSeatToggle = (row, number) => {
    const seatKey = `${row}${number}`;
    setSelectedSeats((prevSeats) => {
      const seatExists = prevSeats.some((seat) => seat.key === seatKey);

      if (seatExists) {
        // Remove seat if it exists
        return prevSeats.filter((seat) => seat.key !== seatKey);
      } else {
        // Add seat with default grade
        return [...prevSeats, { key: seatKey, grade: "REGULAR", row, number }];
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat.");
      return;
    }

    const updatedData = {
      ...ticketData,
      selectedSeats,
    };

    try {
      setIsLoading(true);
      await updateTicket(ticketId, updatedData); // Send updated data to the backend
      alert("Ticket updated successfully!");
      navigate("/ticket/detailList"); // Redirect after success
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeatButton = (row, number) => {
    const seatKey = `${row}${number}`;
    const isSelected = selectedSeats.some((seat) => seat.key === seatKey);
    const seatGrade = isSelected
      ? selectedSeats.find((seat) => seat.key === seatKey).grade
      : null;

    const isReserved = reservedSeats.some(
      (seat) => seat.row === row && seat.number === number && seat.status === "RESERVED"
    );

    return (
      <button
        key={seatKey}
        onClick={() => !isReserved && handleSeatToggle(row, number)}
        className={`seat-button w-10 h-10 m-1 ${isReserved ? "bg-gray-400" : isSelected ? "bg-blue-400" : "bg-green-200"
          }`}
        disabled={isReserved}
      >
        {seatKey}
        {isSelected && <div className="text-xs">{seatGrade}</div>}
      </button>
    );
  };

  if (!ticketData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Seat Selection Area */}
      <div className="flex-2 p-6 overflow-auto">
        <h2 className="text-center mb-4 text-lg font-bold">Edit Seats</h2>
        <div className="grid grid-cols-6 gap-2">
          {seatRows.map((row) =>
            [...Array(10).keys()].map((num) =>
              renderSeatButton(row, num + 1)
            )
          )}
        </div>
      </div>

      {/* Selected Seat Info */}
      <div className="flex-1 p-5 border-l-2 border-gray-400 overflow-auto">
        <h3 className="text-xl mb-4">Selected Seats</h3>
        <ul className="space-y-2">
          {selectedSeats.map((seat) => (
            <li key={seat.key}>
              {seat.key} - {seat.grade} - {seatPrices[seat.grade]}원
              <button
                className="ml-2 text-red-500"
                onClick={() =>
                  setSelectedSeats((prevSeats) =>
                    prevSeats.filter((s) => s.key !== seat.key)
                  )
                }
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <div className="text-lg font-bold mt-4">
          Total Price: {selectedSeats.reduce((acc, seat) => acc + seatPrices[seat.grade], 0)}원
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Ticket"}
          </button>
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
            onClick={() => navigate("/ticket/detailList")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketEditComponent;
