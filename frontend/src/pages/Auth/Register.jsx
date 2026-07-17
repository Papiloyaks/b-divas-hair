import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/helpers";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !isValidEmail(form.email) || form.password.length < 6) {
      toast.error("Fill all fields — password needs at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to BDIVA Hair.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 bg-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 shadow-sm border border-[#F7E7CE]"
      >
        <h1 className="font-display text-3xl text-center mb-2">Create Account</h1>
        <p className="text-center text-[#6B4F4F] text-sm mb-8">
          Join BDIVA Hair for faster checkout and order tracking
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B4F4F]">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="+234..."
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B4F4F] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#D4AF37] font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
