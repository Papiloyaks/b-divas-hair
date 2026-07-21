import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiGrid, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "../../redux/CartContext";
import { useWishlist } from "../../redux/WishlistContext";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pages that don't open with a full-bleed dark Hero need a dark navbar
  // from the very first frame, otherwise text renders invisible on white.
  const lightBackgroundPages = ["/shop", "/about", "/contact", "/login", "/register", "/dashboard", "/admin", "/product", "/wishlist", "/checkout", "/order"];
  const isLightPage = lightBackgroundPages.some((path) => location.pathname.startsWith(path));
  const useDarkText = scrolled || isLightPage;

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const textColor = useDarkText ? "text-[#0F0F0F]" : "text-[#F7E7CE]";

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    setMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md py-3"
          : isLightPage
          ? "bg-[#FFF8F0]/90 backdrop-blur-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between ${textColor}`}>
        <Link to="/">
          <BrandLogo />
        </Link>

        <ul className="hidden md:flex gap-10 font-body text-sm tracking-wide">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="hover:text-[#D4AF37] transition-colors duration-200"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/wishlist" aria-label="Wishlist" className="relative">
            <FiHeart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0F0F0F] text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button onClick={() => window.openCartDrawer?.()} className="relative" aria-label="Cart">
            <FiShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0F0F0F] text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-label="Account menu"
                className="flex items-center"
              >
                <FiUser size={20} />
              </button>

              {accountMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-48 bg-white text-[#0F0F0F] border border-[#F7E7CE] shadow-lg py-2"
                >
                  <p className="px-4 py-2 text-xs text-[#6B4F4F] truncate border-b border-[#F7E7CE]">
                    {user.name || user.email}
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F7E7CE]/50"
                  >
                    <FiGrid size={14} /> Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F7E7CE]/50"
                    >
                      <FiShield size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-[#F7E7CE]/50"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium border border-current px-4 py-1.5 hover:bg-[#D4AF37] hover:text-[#0F0F0F] hover:border-[#D4AF37] transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden flex flex-col gap-4 px-6 pt-4 pb-6 bg-white/95 backdrop-blur-lg text-[#0F0F0F]"
        >
          {links.map((link) => (
            <li key={link.name}>
              <Link to={link.path} onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login / Sign Up
              </Link>
            </li>
          )}
        </motion.ul>
      )}
    </motion.nav>
  );
};

export default Navbar;