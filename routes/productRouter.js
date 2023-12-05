import { Router } from "express";
const router = Router();
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/productControllers.js";

router.get("/", getAllProducts).post("/", createProduct);
router.get("/search/:price", searchProducts);
router
  .route("/:user/:id")
  .delete(deleteProduct)
  .put(updateProduct)
  .get(getProduct);

export default router;
