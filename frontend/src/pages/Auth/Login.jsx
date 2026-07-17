import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/helpers";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email) || form.password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your details.");
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
        <h1 className="font-display text-3xl text-center mb-2">Welcome Back</h1>
        <p className="text-center text-[#6B4F4F] text-sm mb-8">
          Sign in to track orders and manage your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-[#6B4F4F]">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B4F4F] mt-6">
          New to BDIVA Hair?{" "}
          <Link to="/register" className="text-[#D4AF37] font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
