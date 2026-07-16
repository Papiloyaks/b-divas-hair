// Format a number as Nigerian Naira, e.g. formatNaira(85000) -> "₦85,000"
export const formatNaira = (amount = 0) =>
  `₦${Number(amount).toLocaleString("en-NG")}`;

// Turn "Luxury Bone Straight Wig" into "luxury-bone-straight-wig"
export const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Conditionally join class names, skipping falsy values
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// Truncate long text with an ellipsis
export const truncate = (text = "", maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;

// Basic email format check for client-side form validation
export const isValidEmail = (email = "") => /^\S+@\S+\.\S+$/.test(email);
