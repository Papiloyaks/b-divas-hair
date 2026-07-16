// A self-contained, inline SVG logo mark for B-Diva's Hair.
// Uses `currentColor` for the ring/monogram so it automatically matches
// whatever text color the Navbar is using (light on the dark Hero, dark
// once scrolled or on light-background pages) — no separate light/dark
// image assets needed.

const BrandLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer ring */}
        <circle cx="20" cy="20" r="18.5" stroke="#D4AF37" strokeWidth="1" />
        {/* Inner hairline ring for a jewelry-like double-border feel */}
        <circle cx="20" cy="20" r="15.5" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />

        {/* Interlocking "B" + "D" monogram, drawn as paths so it scales crisply */}
        <text
          x="20"
          y="23"
          textAnchor="middle"
          fontFamily="Playfair Display, Georgia, serif"
          fontSize="15"
          fontWeight="600"
          fill="currentColor"
        >
          BD
        </text>

        {/* Small flourish dot, a recurring brand accent */}
        <circle cx="20" cy="9.5" r="1.1" fill="#D4AF37" />
      </svg>

      <span className="font-display text-2xl tracking-wide leading-none">
        B-Diva<span className="text-[#D4AF37]">'s</span>
        <span className="block text-[0.55em] tracking-[0.35em] font-body font-normal uppercase mt-0.5">
          Hair
        </span>
      </span>
    </div>
  );
};

export default BrandLogo;