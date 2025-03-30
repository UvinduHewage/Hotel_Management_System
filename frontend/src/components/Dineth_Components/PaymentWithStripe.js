import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CustomCardForm from "./CustomCardForm";

const stripePromise = loadStripe("pk_test_51R5PyFC8IDGMDNld0b2JntyZKfEuwelrOBGnNaK7MhZjy8ZBebz1zg7OhNitFPmBu6rLPdkGEdHAUJFvWVo2WWmr00gAdanMVQ");

const PaymentWithStripe = () => (
  <Elements stripe={stripePromise}>
    <CustomCardForm />
  </Elements>
);

export default PaymentWithStripe;
