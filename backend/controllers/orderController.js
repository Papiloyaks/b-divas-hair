import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Order from "../models/Order.js";
import { initializeTransaction, verifyTransaction } from "../services/paystackService.js";

// @desc   Create a new order and get a Paystack payment link
// @route  POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { products, amount, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const reference = `bdivas_${crypto.randomBytes(8).toString("hex")}`;

  const order = await Order.create({
    user: req.user._id,
    products,
    amount,
    shippingAddress,
    paymentReference: reference,
  });

  const payment = await initializeTransaction({
    email: req.user.email,
    amount,
    reference,
    callback_url: `${process.env.CLIENT_URL}/order/verify`,
  });

  res.status(201).json({ order, authorizationUrl: payment.data?.authorization_url });
});

// @desc   Verify a Paystack payment and mark order as paid
// @route  GET /api/orders/verify/:reference
export const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const result = await verifyTransaction(reference);

  const order = await Order.findOne({ paymentReference: reference });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (result.data?.status === "success") {
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();
  } else {
    order.paymentStatus = "failed";
    await order.save();
  }

  res.json(order);
});

// @desc   Get logged-in user's orders
// @route  GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc   Get all orders (admin)
// @route  GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// @desc   Update order status (admin)
// @route  PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  await order.save();
  res.json(order);
});
