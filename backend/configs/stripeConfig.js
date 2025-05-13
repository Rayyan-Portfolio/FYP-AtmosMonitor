const stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables.");
}

// Initialize Stripe with the secret key
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripeInstance;
