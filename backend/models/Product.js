import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: {
      type: String,
      enum: ["wig", "bundle", "closure", "frontal", "accessory"],
      required: true,
    },
    length: { type: String }, // e.g. "18 inches"
    color: { type: String },
    texture: { type: String }, // e.g. "straight", "curly", "wavy"
    vendor: { type: String, default: "B-Diva's Hair" },
    stock: { type: Number, required: true, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    ratingsAverage: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
