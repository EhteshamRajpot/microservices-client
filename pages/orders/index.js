import Link from "next/link";
import { buildClient } from "../../api/build-client";

export default function OrderIndex({ orders, fetchError }) {
  if (fetchError) {
    return (
      <div className="container">
        <h1>My orders</h1>
        <div className="alert alert-warning">{fetchError}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My orders</h1>
      {!orders?.length ? (
        <p>You have no orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.ticket?.title ?? "—"}</td>
                <td>${order.ticket?.price ?? "—"}</td>
                <td>{order.status}</td>
                <td>
                  <Link href={`/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

OrderIndex.getInitialProps = async (context) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get("/api/orders");
    const orders = Array.isArray(data)
      ? data
      : Array.isArray(data?.orders)
        ? data.orders
        : [];
    return { orders };
  } catch (err) {
    const status = err.response?.status;
    const hint =
      status === 401 || status === 403
        ? " Sign in again on this same host (e.g. https://ticketing.dev vs localhost mixes cookies)."
        : status === 404
          ? " Check that the orders service and ingress route GET /api/orders."
          : status === 502 || status === 503
            ? " Ingress could not reach orders (pod crashed or restarting). Check kubectl logs for orders-depl — often a NATS listener threw."
            : "";
    return {
      orders: [],
      fetchError: `Could not load orders (HTTP ${status ?? err.code ?? "error"}).${hint}`,
    };
  }
};
