import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// @desc   Get all products (search + filter + pagination)
// @route  GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, texture, color, page = 1, limit = 12 } = req.query;

  const query = {};
  if (keyword) query.name = { $regex: keyword, $options: "i" };
  if (category) query.category = category;
  if (texture) query.texture = texture;
  if (color) query.color = color;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(Number(limit))
    .skip(Number(limit) * (Number(page) - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page: Number(page), pages: Math.ceil(count / limit), total: count });
});

// @desc   Get single product by slug
// @route  GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "reviews.user",
    "name avatar"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc   Create a product (admin)
// @route  POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({ ...req.body, images: [] });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc   Update a product (admin)
// @route  PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @desc   Delete a product (admin)
// @route  DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.publicId);
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

// @desc   Upload product images (admin)
// @route  POST /api/products/:id/images
export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const files = req.files || [];
  const uploaded = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "b-divas-hair/products" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(file.buffer);
    });
    uploaded.push({ url: result.secure_url, publicId: result.public_id });
  }

  product.images.push(...uploaded);
  await product.save();
  res.json(product);
});

// @desc   Add a review to a product
// @route  POST /api/products/:id/reviews
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.reviews.push({ user: req.user._id, rating, comment });
  product.ratingsAverage =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});
