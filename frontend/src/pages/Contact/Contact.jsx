import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { isValidEmail } from "../../utils/helpers";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !isValidEmail(form.email) || !form.message) {
      toast.error("Please fill in all fields with a valid email");
      return;
    }
    setSubmitting(true);
    // Wire this up to a backend /api/contact endpoint or an email service
    // (e.g. Nodemailer route, Formspree, or EmailJS) once ready.
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[#D4AF37] tracking-widest text-sm uppercase mb-3">Get In Touch</p>
        <h1 className="font-display text-4xl">We'd Love to Hear From You</h1>
        <p className="text-[#6B4F4F] mt-3">
          Questions about an order, a product, or a bulk/wholesale request? Reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 flex items-center justify-center bg-[#0F0F0F] text-[#D4AF37] rounded-full shrink-0">
              <FiMapPin size={18} />
            </div>
            <div>
              <h4 className="font-medium">Showroom</h4>
              <p className="text-[#6B4F4F] text-sm">Lekki Phase 1, Lagos, Nigeria</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 flex items-center justify-center bg-[#0F0F0F] text-[#D4AF37] rounded-full shrink-0">
              <FiMail size={18} />
            </div>
            <div>
              <h4 className="font-medium">Email</h4>
              <a href="mailto:hello@bdivashair.com" className="text-[#6B4F4F] text-sm hover:text-[#D4AF37]">
                hello@bdivashair.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 flex items-center justify-center bg-[#0F0F0F] text-[#D4AF37] rounded-full shrink-0">
              <FiPhone size={18} />
            </div>
            <div>
              <h4 className="font-medium">Phone</h4>
              <p className="text-[#6B4F4F] text-sm">+234 800 000 0000</p>
            </div>
          </div>

          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#25D366] text-white hover:opacity-90 transition-opacity"
          >
            <FaWhatsapp size={18} /> Chat on WhatsApp
          </a>

          {/* Map placeholder — swap the src for a real Google Maps embed URL */}
          <div className="mt-8 aspect-video bg-[#F7E7CE] flex items-center justify-center text-[#6B4F4F] text-sm">
            Map embed goes here (Google Maps iframe)
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-sm text-[#6B4F4F]">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B4F4F]">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full mt-1 border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0F0F0F] text-white hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
