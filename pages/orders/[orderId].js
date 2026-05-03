import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { buildClient } from "../../api/build-client";

const OrderPaymentSection = dynamic(
  () => import("../../components/order-payment-section"),
  { ssr: false }
);

function formatExpiration(date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function OrderContent({ order }) {
  const expiresAt = useMemo(() => new Date(order.expiresAt), [order.expiresAt]);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const msLeft = expiresAt.getTime() - Date.now();
      setSecondsLeft(Math.max(0, Math.floor(msLeft / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const countdownLabel = `${minutes}:${secs.toString().padStart(2, "0")}`;

  const ticketTitle = order.ticket?.title ?? "—";
  const ticketPrice = order.ticket?.price ?? "—";
  const showPayment =
    order.status === "created" && secondsLeft > 0;

  return (
    <div className="container">
      <h1>Order details</h1>

      <div className="alert alert-secondary">
        <div>
          <strong>Time remaining to pay:</strong>{" "}
          <span className={secondsLeft <= 60 ? "text-danger fw-bold" : ""}>
            {countdownLabel}
          </span>
        </div>
        <div className="mt-1">
          <strong>Expires at:</strong> {formatExpiration(expiresAt)}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ticketTitle}</td>
            <td>${ticketPrice}</td>
            <td>{order.status}</td>
          </tr>
        </tbody>
      </table>

      {order.status === "complete" && (
        <div className="alert alert-success">This order is paid.</div>
      )}
      {order.status === "cancelled" && (
        <div className="alert alert-warning">
          This order was cancelled or expired before payment.
        </div>
      )}
      {order.status === "created" && secondsLeft <= 0 && (
        <div className="alert alert-warning">
          This order expired. Create a new order from the ticket page.
        </div>
      )}

      {showPayment && <OrderPaymentSection orderId={order.id} />}
    </div>
  );
}

export default function OrderShow({ order }) {
  if (!order) {
    return (
      <div className="container">
        <h1>Order not found</h1>
      </div>
    );
  }

  return <OrderContent order={order} />;
}

OrderShow.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { orderId } = context.query;
  if (!orderId) {
    return { order: null };
  }
  try {
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
  } catch {
    return { order: null };
  }
};
