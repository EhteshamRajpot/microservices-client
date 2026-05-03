import { buildClient } from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Link from "next/link";

export default function TicketPage({ ticket, currentUser }) {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId: ticket?.id,
    },
    onSuccess: (order) => {
      Router.push(`/orders/${order.id}`);
    },
  });

  if (!ticket) {
    return (
      <div className="container">
        <h1>Ticket not found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{ticket.title}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
          </tr>
        </tbody>
      </table>

      {!currentUser && (
        <div className="alert alert-warning">
          You need to{" "}
          <Link href="/auth/signin">sign in</Link> to purchase this ticket.
        </div>
      )}

      {ticket.orderId && (
        <div className="alert alert-secondary">
          This ticket is currently reserved by an active order.
        </div>
      )}

      <button
        type="button"
        onClick={() => doRequest()}
        className="btn btn-primary"
        disabled={!currentUser || Boolean(ticket.orderId)}
      >
        Purchase
      </button>
      {errors}
    </div>
  );
}

TicketPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const id = context.query.ticketId;
  if (!id) {
    return { ticket: null };
  }
  try {
    const { data } = await client.get(`/api/tickets/${id}`);
    return { ticket: data };
  } catch {
    return { ticket: null };
  }
};
