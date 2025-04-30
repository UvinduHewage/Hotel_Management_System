const Stripe = require('stripe');
const dotenv = require('dotenv');
const Payment = require('../../models/Dineth_models/payment');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, metadata = {} } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency are required." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata,
    });

    console.log("✅ Created Payment Intent:", paymentIntent.id);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Error creating PaymentIntent:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Stripe Webhook - Handle Payment Confirmation
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    console.log(`⚡ Stripe event received: ${event.type}`);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      console.log("✅ Payment succeeded. Saving to MongoDB...");

      const newPayment = new Payment({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        nicNumber: paymentIntent.metadata?.nic_number || "",
      });

      await newPayment.save();
      console.log("💾 Payment saved successfully to MongoDB!");
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("⚠️ Stripe Webhook error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
