import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  addProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/images", protect, admin, upload.array("images", 6), uploadProductImages);
router.post("/:id/reviews", protect, addProductReview);

export default router;
