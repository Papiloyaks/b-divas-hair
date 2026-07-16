import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilter, FiX } from "react-icons/fi";
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../services/api";
import { staggerContainer, fadeUp } from "../../animations/variants";

const CATEGORIES = ["wig", "bundle", "closure", "frontal", "accessory"];
const TEXTURES = ["straight", "wavy", "curly", "kinky"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    category: searchParams.get("category") || "",
    texture: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        );
        const { data } = await api.get("/products", { params });
        setProducts(data.products);
      } catch {
        // API not running yet during local dev — fall back to empty state,
        // ProductCard renders its own placeholder content.
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () =>
    setFilters({ keyword: "", category: "", texture: "", minPrice: "", maxPrice: "" });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display">Shop All</h1>
        <p className="text-[#6B4F4F] mt-2">Wigs, bundles, closures & frontals — 100% human hair.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Filters sidebar */}
        <aside className="md:w-64 shrink-0">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 border border-[#0F0F0F]"
          >
            <FiFilter size={16} /> Filters
          </button>

          <div className={`${filtersOpen ? "block" : "hidden"} md:block space-y-8`}>
            <div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.keyword}
                onChange={(e) => updateFilter("keyword", e.target.value)}
                className="w-full border border-[#F7E7CE] px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => updateFilter("category", cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide">Texture</h4>
              <div className="space-y-2">
                {TEXTURES.map((tex) => (
                  <label key={tex} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                    <input
                      type="radio"
                      name="texture"
                      checked={filters.texture === tex}
                      onChange={() => updateFilter("texture", tex)}
                    />
                    {tex}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide">Price Range (₦)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-1/2 border border-[#F7E7CE] px-2 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-1/2 border border-[#F7E7CE] px-2 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-[#6B4F4F] hover:text-[#D4AF37]"
            >
              <FiX size={14} /> Clear filters
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#F7E7CE] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(products.length > 0 ? products : Array.from({ length: 6 })).map((product, i) => (
                <motion.div key={product?._id || i} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
