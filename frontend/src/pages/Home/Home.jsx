import Hero from "../../components/Hero/Hero";
import ProductCard from "../../components/ProductCard/ProductCard";

const Home = () => {
  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl text-center mb-4">Featured Collections</h2>
        <p className="text-center text-[#6B4F4F] mb-12">
          Hand-picked luxury pieces, just for you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Once the backend is running, fetch real featured products from
              GET /api/products?limit=4 and map over them here instead. */}
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>

      <section className="bg-[#F7E7CE] py-24 px-6 text-center">
        <h2 className="text-3xl mb-10">Why Choose BDIVA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-4xl text-[#D4AF37] font-bold">10,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div>
            <h3 className="text-4xl text-[#D4AF37] font-bold">500+</h3>
            <p>Premium Products</p>
          </div>
          <div>
            <h3 className="text-4xl text-[#D4AF37] font-bold">98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
