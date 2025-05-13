const stripe = require("../configs/stripeConfig"); 

const createPaymentIntent = async (req, res) => {
  try {
    const { token, cardholderName, email, selectedPlan } = req.body; // Extract cardholder name, email, and plan details from the request body

    let amount = 0;
    let description = "";

          if (!selectedPlan) {
            return res.status(400).json({ error: "No selected plan provided" });
          }
    // Set amount and description based on the selected plan
    if (selectedPlan.id === 1) {
      amount = 0; // Free trial
      description = "AtmosMonitor 7-Day Free Trial - Enjoy premium features for 7 days.";
    } else if (selectedPlan.id === 2) {
      amount = 500000; // 5,000 PKR 
      description =
        "AtmosMonitor Monthly Plan - Get access to premium features for one month.";
    } else if (selectedPlan.id === 3) {
      amount = 5000000; // 50,000 PKR
      description =
        "AtmosMonitor Yearly Plan - Get access to premium features for one year.";
    }

    // Create a PaymentIntent with the received token and customer details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (1000 = 10 USD)
      currency: "pkr",
      payment_method_data: {
        type: "card",
        card: {
          token: token,
        },
        billing_details: {
          name: cardholderName, // Set cardholder's name
        },
      },
      confirm: true, // Automatically confirm the payment
      receipt_email: email, // Send a receipt email to the customer
      description: description, // Description based on the plan
      return_url: "http://localhost:3000/Checkout", // Provide a return URL for redirects
    });

    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error("Payment error: ", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPaymentIntent };
