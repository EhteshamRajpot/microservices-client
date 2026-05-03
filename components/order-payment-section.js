import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./stripe-payment-form";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function OrderPaymentSection({ orderId }) {
  if (!stripePromise) {
    return (
      <div className="alert alert-warning mt-4">
        <strong>Configure Stripe:</strong> set{" "}
        <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in{" "}
        <code>.env</code> or <code>.env.local</code> (Stripe Dashboard →
        Developers → API keys → Publishable key). Restart{" "}
        <code>npm run dev</code> after changing env.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm orderId={orderId} />
    </Elements>
  );
}
