import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiTrash2, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import { useWishlist } from "../../redux/WishlistContext";
import { useCart } from "../../redux/CartContext";
import { formatNaira } from "../../utils/helpers";
import { staggerContainer, fadeUp } from "../../animations/variants";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem(item, 1);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl mb-2">Your Wishlist</h1>
      <p className="text-[#6B4F4F] mb-10">
        {items.length > 0
          ? `${items.length} saved item${items.length > 1 ? "s" : ""}`
          : "Save your favorite pieces here."}
      </p>

      {items.length === 0 ? (
        <div className="text-center py-20 text-[#6B4F4F]">
          <FiHeart size={40} className="mx-auto mb-4 opacity-40" />
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="inline-block mt-4 text-[#D4AF37] underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item._id}
              variants={fadeUp}
              className="group relative bg-white border border-[#F7E7CE] overflow-hidden"
            >
              <Link to={`/product/${item.slug}`}>
                <div className="aspect-[4/5] bg-[#F7E7CE] overflow-hidden">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              <button
                onClick={() => removeItem(item._id)}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                aria-label="Remove from wishlist"
              >
                <FiTrash2 size={15} />
              </button>

              <div className="p-4">
                <h3 className="font-body text-sm truncate">{item.name}</h3>
                <p className="text-[#D4AF37] font-semibold mt-1">
                  {formatNaira(item.discountPrice || item.price)}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#0F0F0F] text-white text-sm py-2 hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
                >
                  <FiShoppingBag size={14} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;