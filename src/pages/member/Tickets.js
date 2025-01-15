import { Link } from 'react-router-dom';

const Tickets = ({ myPageData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Tickets</h2>
      {myPageData.tickets.length > 0 ? (
        <ul>
          {myPageData.tickets.map((ticket) => (
            <li key={ticket.id}>  {/* 각 티켓 항목 */}
              <p>
                <strong>Away Team:</strong> {ticket.awayTeam}  {/* 상대팀 정보 */}
              </p>
              <p>
                <strong>Price:</strong> {ticket.price} USD  {/* 티켓 가격 */}
              </p>
              <Link to={`/tickets/${ticket.id}`} className="text-blue-500 hover:underline">View Ticket</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
};

export default Tickets; 