import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Checkout.css";

const stripePromise = loadStripe(
  "pk_test_51PrqlEFFiMfQ2Frs1hYTODNNUs58vhZ2VE5FjIlWbD5mjw43tSkSq4JmqrsxKhusEkCilTCZTvMvfnfa7jXSQSQ600WWvx8NS2"
);

const CheckoutForm = ({ cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    const fetchClientSecret = async () => {
      const totalAmount =
        cart.reduce((sum, item) => sum + parseFloat(item.price), 0) * 100; // Convert to cents
      const response = await axios.post(
        "http://localhost:5000/payment/create-payment-intent",
        {
          amount: totalAmount,
        }
      );
      setClientSecret(response.data.clientSecret);
    };

    fetchClientSecret();
  }, [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={processing || succeeded}>
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="card-error">{error}</div>}
      {succeeded && <div className="payment-success">Payment succeeded!</div>}
    </form>
  );
};

const Checkout = ({ cart }) => {
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} />
      </Elements>
    </div>
  );
};

export default Checkout;
