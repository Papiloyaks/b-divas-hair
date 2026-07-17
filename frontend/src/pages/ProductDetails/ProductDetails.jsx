import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiMinus, FiPlus, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useCart } from "../../redux/CartContext";
import { formatNaira } from "../../utils/helpers";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch {
        // Fallback demo product for local preview before the backend is wired up
        setProduct({
          _id: "demo",
          name: "Luxury Bone Straight Wig — 22 inches",
          price: 145000,
          description:
            "Cut from 100% virgin human hair, this bone-straight lace front wig delivers a natural hairline and effortless shine. Pre-plucked, bleached knots, and ready to wear straight out of the box.",
          category: "wig",
          length: "22 inches",
          texture: "straight",
          color: "Natural Black",
          stock: 12,
          ratingsAverage: 4.8,
          images: [
            { url: "https://placehold.co/600x750/0F0F0F/D4AF37?text=BDIVA%20Hair+1" },
            { url: "https://placehold.co/600x750/6B4F4F/F7E7CE?text=BDIVA%20Hair+2" },
            { url: "https://placehold.co/600x750/D4AF37/0F0F0F?text=BDIVA%20Hair+3" },
          ],
          reviews: [
            { _id: "1", user: { name: "Amaka O." }, rating: 5, comment: "Melted into my skin perfectly, super soft strands." },
            { _id: "2", user: { name: "Ifeoma C." }, rating: 4, comment: "Beautiful wig, shipping took a few extra days." },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="pt-40 text-center text-[#6B4F4F]">Loading product…</div>;
  }

  if (!product) {
    return <div className="pt-40 text-center text-[#6B4F4F]">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/5] bg-[#F7E7CE] overflow-hidden"
          >
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-24 overflow-hidden border-2 ${
                  activeImage === i ? "border-[#D4AF37]" : "border-transparent"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl">{product.name}</h1>

          <div className="flex items-center gap-1 mt-2 text-[#D4AF37]">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={16}
                className={i < Math.round(product.ratingsAverage) ? "fill-[#D4AF37]" : "text-[#F7E7CE]"}
              />
            ))}
            <span className="text-sm text-[#6B4F4F] ml-2">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="text-2xl text-[#D4AF37] font-semibold mt-4">{formatNaira(product.price)}</p>

          <p className="text-[#6B4F4F] mt-4 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <p className="text-[#6B4F4F]">Length</p>
              <p className="font-medium">{product.length}</p>
            </div>
            <div>
              <p className="text-[#6B4F4F]">Texture</p>
              <p className="font-medium capitalize">{product.texture}</p>
            </div>
            <div>
              <p className="text-[#6B4F4F]">Color</p>
              <p className="font-medium">{product.color}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-[#F7E7CE] px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <FiMinus size={14} />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <FiPlus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
            >
              Add to Cart
            </button>

            <button className="w-12 h-12 flex items-center justify-center border border-[#F7E7CE] hover:border-[#D4AF37]">
              <FiHeart size={18} />
            </button>
          </div>

          <button className="w-full mt-4 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors">
            Buy Now
          </button>

          <p className="text-xs text-[#6B4F4F] mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"} · Ships within 24-48hrs from Lagos
          </p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24 max-w-3xl">
        <h2 className="font-display text-2xl mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {product.reviews?.map((review) => (
            <div key={review._id} className="border-b border-[#F7E7CE] pb-6">
              <div className="flex items-center gap-2 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    size={13}
                    className={i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#F7E7CE]"}
                  />
                ))}
              </div>
              <p className="font-medium text-sm">{review.user.name}</p>
              <p className="text-[#6B4F4F] text-sm mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
