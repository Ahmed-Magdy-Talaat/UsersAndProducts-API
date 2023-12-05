import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getUsersWitProducts,
  createUser,
  deleteUser,
  updateUser,
  searchByIDS,
  searchUsers,
} from "../controllers/userControllers.js";

router.route("/search/:age/:letter").get(searchUsers);
router.route("/search/:ids").get(searchByIDS);
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/products").get(getUsersWitProducts);

export default router;
