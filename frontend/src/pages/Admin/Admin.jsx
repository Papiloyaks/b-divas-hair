import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import { formatNaira } from "../../utils/helpers";
import { placeholderImage } from "../../utils/placeholder";
import ProductFormModal from "./ProductFormModal";

const TABS = ["Overview", "Products", "Orders", "Customers", "Reviews", "Newsletter"];
const ORDER_STATUSES = ["processing", "confirmed", "packed", "shipped", "delivered"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 50 } });
      setProducts(data.products);
    } catch {
      toast.error("Could not load products. Is the backend running?");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      toast.error("Could not load orders. Are you logged in as an admin?");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "Products") fetchProducts();
    if (activeTab === "Orders") fetchOrders();
  }, [activeTab, fetchProducts, fetchOrders]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update order status");
    }
  };

  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl mb-2">Admin Dashboard</h1>
      <p className="text-[#6B4F4F] mb-10">Manage products, orders, customers, and reviews.</p>

      <div className="flex gap-8 border-b border-[#F7E7CE] mb-10 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-[#0F0F0F] border-b-2 border-[#D4AF37]"
                : "text-[#6B4F4F]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Revenue", value: formatNaira(revenue), icon: FiDollarSign },
            { label: "Orders", value: orders.length || "—", icon: FiShoppingBag },
            { label: "Customers", value: "—", icon: FiUsers },
            { label: "Products", value: products.length || "—", icon: FiBox },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-[#F7E7CE] p-6">
              <div className="w-10 h-10 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center mb-4">
                <card.icon size={18} />
              </div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-[#6B4F4F]">{card.label}</p>
            </div>
          ))}
          <p className="md:col-span-4 text-xs text-[#6B4F4F]">
            Visit the Products and Orders tabs to load live numbers from your database.
          </p>
        </motion.div>
      )}

      {activeTab === "Products" && (
        <div>
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 mb-6 px-5 py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors text-sm"
          >
            <FiPlus size={16} /> Add New Product
          </button>

          {loadingProducts ? (
            <p className="text-[#6B4F4F] py-12 text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-[#6B4F4F] py-12 text-center">
              No products yet. Click "Add New Product" to create your first one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F7E7CE] text-left text-[#6B4F4F]">
                    <th className="py-3">Image</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Stock</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-[#F7E7CE]/60">
                      <td className="py-3">
                        <img
                          src={p.images?.[0]?.url || placeholderImage(60, 60, "")}
                          alt={p.name}
                          className="w-12 h-12 object-cover bg-[#F7E7CE]"
                        />
                      </td>
                      <td className="py-3">{p.name}</td>
                      <td className="py-3 capitalize">{p.category}</td>
                      <td className="py-3">{formatNaira(p.price)}</td>
                      <td className="py-3">{p.stock}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-[#6B4F4F] hover:text-red-500"
                          aria-label="Delete product"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showProductModal && (
            <ProductFormModal
              onClose={() => setShowProductModal(false)}
              onCreated={fetchProducts}
            />
          )}
        </div>
      )}

      {activeTab === "Orders" && (
        <div className="overflow-x-auto">
          {loadingOrders ? (
            <p className="text-[#6B4F4F] py-12 text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-[#6B4F4F] py-12 text-center">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F7E7CE] text-left text-[#6B4F4F]">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Payment</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-[#F7E7CE]/60">
                    <td className="py-3">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3">{o.user?.name || "Unknown"}</td>
                    <td className="py-3">{formatNaira(o.amount)}</td>
                    <td className="py-3 capitalize">{o.paymentStatus}</td>
                    <td className="py-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="border border-[#F7E7CE] px-2 py-1 text-xs capitalize focus:outline-none focus:border-[#D4AF37]"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "Customers" && (
        <p className="text-[#6B4F4F] py-12 text-center">
          Customer list connects to <code>GET /api/users</code> once that endpoint is added on the backend.
        </p>
      )}

      {activeTab === "Reviews" && (
        <p className="text-[#6B4F4F] py-12 text-center">
          Approve or delete reviews here — connects to the <code>Review</code> model via a future
          <code> /api/reviews</code> admin route.
        </p>
      )}

      {activeTab === "Newsletter" && (
        <p className="text-[#6B4F4F] py-12 text-center">
          Manage newsletter subscribers here once a <code>Subscriber</code> model and route are added.
        </p>
      )}
    </div>
  );
};

export default Admin;