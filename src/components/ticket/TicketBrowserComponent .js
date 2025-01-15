import React, { useState, useEffect } from "react";
import { getAllTickets, deleteTicket } from "../api/ticketApi";
import { useNavigate } from "react-router-dom";
// 티켓 수정,삭제 목록을 보여주고 수정 삭제
const TicketTableComponent = () => {
  const [tickets, setTickets] = useState([]); // Store all ticket objects
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all ticket objects when the component loads
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const allTickets = await getAllTickets(); // Assumes `getAllTickets` API returns a list of tickets
        console.log("all tickets:", allTickets);
        setTickets(allTickets); // Store all ticket data
      } catch (err) {
        setError("Failed to load tickets. Please try again.");
      }
    };

    fetchTickets();
  }, []);

  // Handle ticket editing
  const handleEdit = (ticketId) => {
    try {
      navigate(`/ticket/edit/${ticketId}`);
    } catch (err) {
      alert("Failed to navigate to the edit page. Please try again.");
    }
  };

  // Handle ticket deletion
  const handleDelete = async (ticketId) => {
    try {
      if (window.confirm("Are you sure you want to delete this ticket?")) {
        await deleteTicket(ticketId);
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
        alert("Ticket deleted successfully!");
        window.location.reload()
      }
    } catch (err) {
      alert("Failed to delete the ticket. Please try again.");
    }
  };

  return (
    <div>
      <h1>Ticket Management</h1>

      {/* Display error if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Ticket Table */}
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold">ID</th>
            <th className="p-4 text-left text-sm font-semibold">Member Name</th>
            <th className="p-4 text-left text-sm font-semibold">Away Team</th>
            <th className="p-4 text-left text-sm font-semibold">Seat Info</th>
            <th className="p-4 text-left text-sm font-semibold">Game ID</th>
            <th className="p-4 text-left text-sm font-semibold">Price</th>
            <th className="p-4 text-left text-sm font-semibold">Ticket Date</th>
            <th className="p-4 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(tickets || [])
            .filter((ticket) =>
              ticket.selectedSeats?.some((seat) => seat.status === "RESERVED") // Filter tickets with RESERVED status
            )
            .map((ticket) => (
              <tr key={ticket.ticketId} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                <td className="p-4 text-sm font-bold text-gray-800">{ticket.ticketId}</td>
                <td className="p-4 text-sm text-gray-700">{ticket.memberName || "N/A"}</td>
                <td className="p-4 text-sm text-gray-700">{ticket.awayTeam || "N/A"}</td>
                <td className="p-4 text-sm text-gray-700">
                  {ticket.selectedSeats && ticket.selectedSeats.length > 0 ? (
                    <div>
                      {ticket.selectedSeats
                        .filter((seat) => seat.status === "RESERVED") // Show only RESERVED seats
                        .map((seat, index) => (
                          <div key={index} className="mb-1">
                            <strong>{seat.seatInfo || "N/A"}</strong>
                          </div>
                        ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="p-4 text-sm text-gray-700">{ticket.gameId}</td>
                <td className="p-4 text-sm text-gray-700">{ticket.price}</td>
                <td className="p-4 text-sm text-gray-700">{ticket.ticketDate}</td>
                <td className="p-4 text-center">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition"
                    onClick={() => handleEdit(ticket.ticketId)}
                  >
                    수정
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition ml-2"
                    onClick={() => handleDelete(ticket.ticketId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTableComponent;
