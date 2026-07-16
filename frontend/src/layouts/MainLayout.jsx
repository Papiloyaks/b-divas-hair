import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import CartDrawer from "../components/Cart/CartDrawer";
import { pageTransition } from "../animations/variants";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          {...pageTransition}
          className="flex-1"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default MainLayout;
