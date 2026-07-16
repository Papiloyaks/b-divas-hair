import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiCheckCircle, FiUser, FiHeart, FiDownload } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { formatNaira } from "../../utils/helpers";
import api from "../../services/api";

const TABS = ["Overview", "My Orders", "Profile", "Wishlist"];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus !== "delivered").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl mb-2">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-[#6B4F4F] mb-10">Manage your orders, profile, and saved items.</p>

      {/* Tabs */}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Total Orders", value: stats.total, icon: FiPackage },
            { label: "Pending Orders", value: stats.pending, icon: FiClock },
            { label: "Delivered Orders", value: stats.delivered, icon: FiCheckCircle },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-[#F7E7CE] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center">
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="text-sm text-[#6B4F4F]">{card.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "My Orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-[#6B4F4F] text-center py-12">
              No orders yet.{" "}
              <a href="/shop" className="text-[#D4AF37] underline">
                Start shopping
              </a>
            </p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="border border-[#F7E7CE] p-5 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-[#6B4F4F]">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="font-medium">{formatNaira(order.amount)}</p>
                </div>
                <span className="text-xs px-3 py-1 bg-[#F7E7CE] rounded-full capitalize">
                  {order.orderStatus}
                </span>
                <button className="flex items-center gap-1 text-sm text-[#D4AF37]">
                  <FiDownload size={14} /> Invoice
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "Profile" && (
        <div className="max-w-md space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center text-xl">
              <FiUser size={24} />
            </div>
            <div>
              <p className="font-medium">{user?.name || "Guest User"}</p>
              <p className="text-sm text-[#6B4F4F]">{user?.email}</p>
            </div>
          </div>
          <button className="px-6 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors text-sm">
            Edit Details
          </button>
          <button className="px-6 py-3 border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-colors text-sm ml-3">
            Change Password
          </button>
        </div>
      )}

      {activeTab === "Wishlist" && (
        <div className="text-center py-12 text-[#6B4F4F]">
          <FiHeart size={32} className="mx-auto mb-3 opacity-40" />
          <p>Your wishlist is empty. Save products from the shop to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
