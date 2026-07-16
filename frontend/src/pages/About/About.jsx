import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";

const gallery = [
  "https://placehold.co/500x600/0F0F0F/D4AF37?text=B-Diva%27s",
  "https://placehold.co/500x600/6B4F4F/F7E7CE?text=B-Diva%27s",
  "https://placehold.co/500x600/D4AF37/0F0F0F?text=B-Diva%27s",
  "https://placehold.co/500x600/F7E7CE/0F0F0F?text=B-Diva%27s",
];

const About = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Brand story */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[#D4AF37] tracking-widest text-sm uppercase mb-3"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl leading-tight"
        >
          Redefining luxury hair for the modern Nigerian woman
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="text-[#6B4F4F] mt-6 leading-relaxed"
        >
          B-Diva's Hair started with a simple frustration: too many "luxury" hair vendors sold
          bundles that shed within weeks and wigs that never quite matched the photos. We set out
          to build something different — hair sourced directly from trusted vendors, tested for
          quality before it ever reaches a customer, and backed by a brand that treats every order
          like it's going to a queen. Today, we serve thousands of customers across Nigeria and
          beyond who trust us for their most important moments — weddings, graduations, job
          interviews, and everyday confidence.
        </motion.p>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-5xl mx-auto px-6 mt-24 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#0F0F0F] text-[#F7E7CE] p-10"
        >
          <h3 className="font-display text-2xl text-[#D4AF37] mb-4">Our Mission</h3>
          <p className="leading-relaxed text-[#F7E7CE]/80">
            To make premium, ethically-sourced human hair accessible to every Nigerian woman,
            without compromising on quality, honesty, or service.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#F7E7CE] p-10"
        >
          <h3 className="font-display text-2xl mb-4">Our Vision</h3>
          <p className="leading-relaxed text-[#0F0F0F]/80">
            To become West Africa's most trusted luxury hair brand — known as much for our
            integrity as for the quality of every strand we sell.
          </p>
        </motion.div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <h2 className="font-display text-3xl text-center mb-10">Behind the Brand</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {gallery.map((src, i) => (
            <motion.div key={i} variants={fadeUp} className="aspect-[5/6] overflow-hidden">
              <img
                src={src}
                alt="B-Diva's Hair gallery"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values strip */}
      <section className="bg-[#F7E7CE] mt-24 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-display text-xl mb-2">Quality First</h4>
            <p className="text-sm text-[#6B4F4F]">
              Every batch is inspected before it's listed. No shortcuts, no surprises.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xl mb-2">Radical Honesty</h4>
            <p className="text-sm text-[#6B4F4F]">
              What you see in photos is exactly what arrives at your door.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xl mb-2">Customer First</h4>
            <p className="text-sm text-[#6B4F4F]">
              Fast responses, real support, and a team that actually cares.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
