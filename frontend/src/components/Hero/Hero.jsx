import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Drop your own photography into /frontend/public/hero/ using these exact
// filenames (1920x1080 or larger, landscape, JPG/WebP) and they'll appear
// here automatically. Until then, each slide gracefully falls back to a
// brand-colored gradient so the Hero never looks broken.
const SLIDES = [
  { src: "public/hero/hero-1.jpg", fallbackFrom: "#0F0F0F", fallbackTo: "#3a2e1f" },
  { src: "public/hero/hero-2.jpg", fallbackFrom: "#0F0F0F", fallbackTo: "#4a3728" },
  { src: "public/hero/hero-3.jpg", fallbackFrom: "#0F0F0F", fallbackTo: "#2e2119" },
];

const SLIDE_DURATION = 5000;

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const markFailed = (index) => setFailedImages((prev) => ({ ...prev, [index]: true }));

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0F0F0F]">
      {/* Carousel background */}
      <AnimatePresence mode="sync">
        {SLIDES.map(
          (slide, index) =>
            index === activeSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {failedImages[index] ? (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${slide.fallbackFrom}, ${slide.fallbackTo})`,
                    }}
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt=""
                    onError={() => markFailed(index)}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? "w-8 bg-[#D4AF37]" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="font-display text-5xl md:text-7xl text-[#F7E7CE] leading-tight"
        >
          Luxury Hair, <br />
          <span className="text-[#D4AF37]">Luxury Confidence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-6 text-[#F7E7CE]/80 max-w-xl mx-auto font-body"
        >
          Premium 100% human hair, wigs and bundles crafted for the modern queen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 flex gap-5 justify-center"
        >
          <Link
            to="/shop"
            className="px-8 py-3 bg-[#D4AF37] text-[#0F0F0F] font-medium tracking-wide hover:bg-[#c49f2f] transition-colors rounded-xl hover:text-white"
          >
            Shop Collection
          </Link>
          <Link
            to="/shop?category=wig"
            className="px-8 py-3 border border-[#F7E7CE] hover:bg-[#c49f2f] text-[#F7E7CE] font-medium tracking-wide rounded-xl"
          >
            Explore Wigs
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
