import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F] text-[#F7E7CE] pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl text-[#D4AF37] mb-4">
            BDIVA Hair
          </h3>
          <p className="text-sm text-[#F7E7CE]/70">
            Luxury Hair, Luxury Confidence. Premium hair vendor for the modern queen.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-[#F7E7CE]/70">
            <li>Wigs</li>
            <li>Bundles</li>
            <li>Closures</li>
            <li>Frontals</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-[#F7E7CE]/70">
            <li>About Us</li>
            <li>Contact</li>
            <li>Track Order</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <FiInstagram />
            <FiFacebook />
            <FiTwitter />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#F7E7CE]/50 mt-12">
        © {new Date().getFullYear()} BDIVA Hair. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
