import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiUploadCloud, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import { slugify } from "../../utils/helpers";

const CATEGORIES = ["wig", "bundle", "closure", "frontal", "accessory"];
const TEXTURES = ["straight", "wavy", "curly", "kinky"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "wig",
  length: "",
  color: "",
  texture: "straight",
  vendor: "BDIVA Hair",
  stock: "",
};

const ProductFormModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      toast.error("Name, price, and stock are required");
      return;
    }

    setSaving(true);
    try {
      // Step 1: create the product record
      const { data: product } = await api.post("/products", {
        ...form,
        slug: slugify(form.name),
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
      });

      // Step 2: upload images (if any were selected) to Cloudinary via the backend
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        await api.post(`/products/${product._id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Product created successfully");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Add New Product</h2>
          <button onClick={onClose} aria-label="Close">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B4F4F]">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Luxury Bone Straight Wig — 22 inches"
            />
          </div>

          <div>
            <label className="text-sm text-[#6B4F4F]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="100% virgin human hair, pre-plucked lace front..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#6B4F4F]">Price (₦)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                placeholder="145000"
              />
            </div>
            <div>
              <label className="text-sm text-[#6B4F4F]">Discount Price (optional)</label>
              <input
                name="discountPrice"
                type="number"
                value={form.discountPrice}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                placeholder="129000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#6B4F4F]">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37] capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#6B4F4F]">Texture</label>
              <select
                name="texture"
                value={form.texture}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37] capitalize"
              >
                {TEXTURES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[#6B4F4F]">Length</label>
              <input
                name="length"
                value={form.length}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                placeholder="22 inches"
              />
            </div>
            <div>
              <label className="text-sm text-[#6B4F4F]">Color</label>
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Natural Black"
              />
            </div>
            <div>
              <label className="text-sm text-[#6B4F4F]">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                placeholder="12"
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-sm text-[#6B4F4F]">Product Images (up to 6)</label>
            <label className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#F7E7CE] py-8 cursor-pointer hover:border-[#D4AF37] transition-colors">
              <FiUploadCloud size={24} className="text-[#6B4F4F]" />
              <span className="text-sm text-[#6B4F4F]">Click to upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-16 h-16 object-cover border border-[#F7E7CE]" />
                ))}
              </div>
            )}

            {files.length === 0 && (
              <p className="flex items-center gap-1 text-xs text-[#6B4F4F] mt-2">
                <FiImage size={12} /> No images selected — product will show a placeholder until you add some.
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductFormModal;