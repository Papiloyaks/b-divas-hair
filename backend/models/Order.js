import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: { type: String },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "packed", "shipped", "delivered"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
