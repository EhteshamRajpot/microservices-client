import { buildClient } from "../api/build-client";
import Link from "next/link";

const LandingPage = ({ tickets }) => {
  const availableTickets =
    tickets?.filter((t) => !t.orderId) ?? [];

  return (
    <div className="container">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {availableTickets.length > 0 &&
            availableTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                  <Link href={`/tickets/${ticket.id}`}>View</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {availableTickets.length === 0 && (
        <p className="text-muted">No tickets available right now.</p>
      )}
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const pageProps = { currentUser: null, tickets: [] };

  try {
    const { data } = await client.get("/api/users/currentUser");
    Object.assign(pageProps, data);
  } catch {
    // leave currentUser null
  }

  try {
    const { data } = await client.get("/api/tickets");
    pageProps.tickets = Array.isArray(data) ? data : data?.tickets ?? [];
  } catch {
    pageProps.tickets = [];
  }

  return pageProps;
};

export default LandingPage;
