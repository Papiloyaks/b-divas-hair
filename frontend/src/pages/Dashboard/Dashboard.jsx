import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiCheckCircle, FiHeart, FiDownload } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../redux/WishlistContext";
import { formatNaira } from "../../utils/helpers";
import api from "../../services/api";
import ProfileSettings from "./ProfileSettings";

const TABS = ["Overview", "My Orders", "Profile", "Wishlist"];

const Dashboard = () => {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();
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
              <Link to="/shop" className="text-[#D4AF37] underline">
                Start shopping
              </Link>
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

      {activeTab === "Profile" && <ProfileSettings />}

      {activeTab === "Wishlist" && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 text-[#6B4F4F]">
              <FiHeart size={32} className="mx-auto mb-3 opacity-40" />
              <p>Your wishlist is empty. Save products from the shop to see them here.</p>
              <Link to="/shop" className="inline-block mt-3 text-[#D4AF37] underline">
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item.slug}`}
                  className="border border-[#F7E7CE] overflow-hidden group"
                >
                  <div className="aspect-[4/5] bg-[#F7E7CE] overflow-hidden">
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-[#D4AF37] font-semibold text-sm mt-1">
                      {formatNaira(item.discountPrice || item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;