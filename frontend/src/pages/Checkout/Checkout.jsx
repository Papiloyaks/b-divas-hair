import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../../redux/CartContext";
import { useAuth } from "../../hooks/useAuth";
import { formatNaira, isValidEmail } from "../../utils/helpers";
import api from "../../services/api";

const STEPS = ["Shipping", "Delivery", "Payment"];
const SHIPPING_FEES = { standard: 2500, express: 6000 };

const Checkout = () => {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  const shippingFee = SHIPPING_FEES[deliveryMethod];
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="font-display text-2xl mb-4">Your bag is empty</h1>
        <Link to="/shop" className="text-[#D4AF37] underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city || !shipping.state) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        products: items.map((i) => ({
          product: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        amount: total,
        shippingAddress: shipping,
      });

      if (data.authorizationUrl) {
        // Redirect to Paystack's hosted checkout. Paystack will redirect back
        // to CLIENT_URL/order/verify?reference=... after payment.
        window.location.href = data.authorizationUrl;
      } else {
        toast.error("Could not start payment. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order. Is the backend running?");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl mb-2">Checkout</h1>

      {/* Step indicator */}
      <div className="flex gap-6 mb-10 text-sm">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${i <= step ? "text-[#0F0F0F]" : "text-[#6B4F4F]/50"}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i <= step ? "bg-[#D4AF37] text-[#0F0F0F]" : "bg-[#F7E7CE]"
              }`}
            >
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {step === 0 && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleShippingSubmit}
              className="space-y-4"
            >
              <h2 className="font-display text-xl mb-4">Shipping Information</h2>
              <input
                placeholder="Full Name"
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                placeholder="Phone Number"
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                placeholder="Delivery Address"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  placeholder="State"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button className="w-full py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors">
                Continue to Delivery
              </button>
            </motion.form>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl mb-4">Delivery Method</h2>
              <div className="space-y-3">
                {Object.entries(SHIPPING_FEES).map(([key, fee]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-between border px-5 py-4 cursor-pointer ${
                      deliveryMethod === key ? "border-[#D4AF37]" : "border-[#F7E7CE]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === key}
                        onChange={() => setDeliveryMethod(key)}
                      />
                      <span className="capitalize">{key} Delivery</span>
                    </div>
                    <span className="font-medium">{formatNaira(fee)}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl mb-4">Payment</h2>
              <p className="text-[#6B4F4F] mb-6">
                You'll be redirected to Paystack's secure checkout to pay by card, bank transfer,
                or USSD. Your order is created first so we can track it against your payment.
              </p>
              {!isValidEmail(user?.email || "") && (
                <p className="text-sm text-red-500 mb-4">
                  You need to be logged in with a valid email to pay. <Link to="/login" className="underline">Log in</Link>
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#0F0F0F] font-medium hover:bg-[#c49f2f] transition-colors disabled:opacity-60"
                >
                  {placing ? "Redirecting..." : "Pay with Paystack"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-[#F7E7CE]/50 p-6 h-fit">
          <h3 className="font-display text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-[#6B4F4F]">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatNaira(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#0F0F0F]/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatNaira(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;