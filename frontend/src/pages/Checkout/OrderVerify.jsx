import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useCart } from "../../redux/CartContext";
import { formatNaira } from "../../utils/helpers";
import api from "../../services/api";

// Paystack redirects here as: /order/verify?reference=xxx&trxref=xxx
const OrderVerify = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const { clearCart } = useCart();

  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    api
      .get(`/orders/verify/${reference}`)
      .then(({ data }) => {
        setOrder(data);
        if (data.paymentStatus === "paid") {
          setStatus("success");
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="max-w-lg mx-auto px-6 pt-40 pb-24 text-center">
      {status === "checking" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FiLoader className="mx-auto mb-4 animate-spin text-[#D4AF37]" size={40} />
          <h1 className="font-display text-2xl mb-2">Confirming your payment...</h1>
          <p className="text-[#6B4F4F]">This only takes a moment. Please don't close this page.</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <FiCheckCircle className="mx-auto mb-4 text-green-600" size={48} />
          <h1 className="font-display text-2xl mb-2">Payment Successful!</h1>
          <p className="text-[#6B4F4F] mb-6">
            Thank you — your order{order ? ` #${order._id.slice(-6).toUpperCase()}` : ""} has been
            confirmed{order ? ` for ${formatNaira(order.amount)}` : ""}. A confirmation email is on its way.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
          >
            Track Your Order
          </Link>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <FiXCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="font-display text-2xl mb-2">Payment Not Confirmed</h1>
          <p className="text-[#6B4F4F] mb-6">
            We couldn't confirm this payment. If money left your account, contact us with your
            reference and we'll sort it out — nothing was lost.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/contact" className="px-6 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors">
              Contact Support
            </Link>
            <Link to="/checkout" className="px-6 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors">
              Try Again
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderVerify;