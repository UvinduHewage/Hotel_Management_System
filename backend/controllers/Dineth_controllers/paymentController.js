const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const {
      amount,
      currency,
      billing_details = {},
      metadata = {},
    } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Handle Webhook Events
exports.stripeWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent);

        // Optionally log or process metadata like NIC number
        if (paymentIntent.metadata && paymentIntent.metadata.nic_number) {
          console.log("🆔 NIC Number:", paymentIntent.metadata.nic_number);
        }
        break;

      case "payment_intent.payment_failed":
        console.warn("❌ Payment failed:", event.data.object.last_payment_error);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️ Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
