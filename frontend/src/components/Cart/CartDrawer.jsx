import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../redux/CartContext";
import { formatNaira } from "../../utils/helpers";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  // Expose a global opener so Navbar's bag icon can trigger this drawer
  if (typeof window !== "undefined") window.openCartDrawer = () => setOpen(true);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center shadow-lg"
        aria-label="Open cart"
      >
        <FiShoppingBag size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0F0F0F] text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F7E7CE]">
                <h2 className="font-display text-xl">Your Bag ({itemCount})</h2>
                <button onClick={() => setOpen(false)}>
                  <FiX size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="text-center text-[#6B4F4F] mt-20">
                    <FiShoppingBag size={40} className="mx-auto mb-4 opacity-40" />
                    <p>Your bag is empty.</p>
                    <Link
                      to="/shop"
                      onClick={() => setOpen(false)}
                      className="inline-block mt-4 text-[#D4AF37] underline"
                    >
                      Continue shopping
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item._id} className="flex gap-4 py-4 border-b border-[#F7E7CE]/70">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-20 h-24 object-cover bg-[#F7E7CE]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <button onClick={() => removeItem(item._id)} className="text-[#6B4F4F]">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                        <p className="text-[#D4AF37] font-semibold mt-1">{formatNaira(item.price)}</p>

                        <div className="flex items-center gap-3 mt-3 border border-[#F7E7CE] w-fit px-2">
                          <button
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-[#F7E7CE]">
                  <div className="flex justify-between mb-4 text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatNaira(subtotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="block text-center w-full py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
