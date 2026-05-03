import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import Router from "next/router";

export default function StripePaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const { error: stripeError, token } = await stripe.createToken(card);

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        "/api/payments",
        { orderId, token: token.id },
        { withCredentials: true }
      );
      Router.push("/orders");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const msg = Array.isArray(apiErrors)
        ? apiErrors.map((e) => e.message).join(" ")
        : err.response?.data?.message ?? err.message ?? "Payment failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4>Payment</h4>
      <p className="text-muted small mb-2">
        Use Stripe test cards (e.g.{" "}
        <code>4242 4242 4242 4242</code>, any future expiry, any CVC). See{" "}
        <a
          href="https://stripe.com/docs/testing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stripe testing docs
        </a>
        .
      </p>
      <form onSubmit={handleSubmit}>
        <div className="border rounded p-3 mb-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || submitting}
        >
          {submitting ? "Processing…" : "Pay now"}
        </button>
      </form>
    </div>
  );
}
