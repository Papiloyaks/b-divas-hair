// Paystack has no official Node SDK maintained for v2 — we call their REST API
// directly with fetch, which is built into Node.js 18+.

const PAYSTACK_BASE_URL = "https://api.paystack.co";

const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

export const initializeTransaction = async ({ email, amount, reference, callback_url }) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    // Paystack expects amount in kobo (multiply Naira by 100)
    body: JSON.stringify({ email, amount: amount * 100, reference, callback_url }),
  });
  return response.json();
};

export const verifyTransaction = async (reference) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: paystackHeaders(),
  });
  return response.json();
};
