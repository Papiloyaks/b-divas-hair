import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { useWishlist } from "../../redux/WishlistContext";
import { useCart } from "../../redux/CartContext";

const ProductCard = ({ product }) => {
  const { toggleItem, isWishlisted } = useWishlist();
  const { addItem } = useCart();

  // Fallback demo data so the card renders even before the API is wired up.
  // The id is generated once per mount (not on every render) so wishlist
  // toggling stays consistent for this card.
  const [demoId] = useState(() => "demo-" + Math.random().toString(36).slice(2, 8));
  const demo = {
    _id: demoId,
    name: "Luxury Bone Straight Wig",
    slug: "luxury-bone-straight-wig",
    price: 85000,
    discountPrice: null,
    images: [{ url: "https://placehold.co/400x500/0F0F0F/D4AF37?text=BDIVA%20Hair" }],
    ratingsAverage: 4.5,
  };
  const item = product || demo;
  const { _id, name, slug, price, discountPrice, images, ratingsAverage } = item;
  const wished = isWishlisted(_id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    toggleItem(item);
    toast.success(wished ? "Removed from wishlist" : "Added to wishlist", {
      iconTheme: { primary: "#D4AF37", secondary: "#0F0F0F" },
    });
  };

  const addToCart = (e) => {
    e.preventDefault();
    addItem(item, 1);
    toast.success(`${name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white border border-[#F7E7CE] overflow-hidden"
    >
      <Link to={`/product/${slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F7E7CE]">
          <img
            src={images[0]?.url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {discountPrice && (
            <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0F0F0F] text-xs px-2 py-1 font-medium">
              SALE
            </span>
          )}

          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
          >
            <FiHeart className={wished ? "fill-[#D4AF37] text-[#D4AF37]" : ""} size={16} />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={addToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0F0F0F] text-white text-sm py-2 hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
            >
              <FiShoppingBag size={14} /> Add to Cart
            </button>
            <button className="w-9 flex items-center justify-center bg-white text-[#0F0F0F] hover:bg-[#D4AF37] transition-colors">
              <FiEye size={16} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-[#6B4F4F] uppercase tracking-wide">
            {"★".repeat(Math.round(ratingsAverage))}
            <span className="text-[#F7E7CE]">{"★".repeat(5 - Math.round(ratingsAverage))}</span>
          </p>
          <h3 className="mt-1 font-body text-sm text-[#0F0F0F] truncate">{name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-[#D4AF37]">
              ₦{(discountPrice || price).toLocaleString()}
            </span>
            {discountPrice && (
              <span className="text-xs text-[#6B4F4F] line-through">
                ₦{price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;