// Generates a brand-colored placeholder image as an inline SVG data URI.
// Used anywhere we don't yet have a real product photo — works completely
// offline, unlike external services (e.g. placehold.co) which can be slow,
// rate-limited, or blocked on some networks.
export const placeholderImage = (width = 400, height = 500, label = "B-Diva's Hair") => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#0F0F0F"/>
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#D4AF37" stroke-width="1"/>
      <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.round(width / 16)}"
            fill="#D4AF37" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};