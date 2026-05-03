import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Link from "next/link";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price: typeof price === "string" ? parseFloat(price || "0") : price },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  if (!currentUser) {
    return (
      <div className="container">
        <h1>Create a ticket</h1>
        <div className="alert alert-warning">
          Sign in to sell tickets.{" "}
          <Link href="/auth/signin">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Create a ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            className="form-control"
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
