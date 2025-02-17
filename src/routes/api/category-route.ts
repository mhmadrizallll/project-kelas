import express from "express";
const router = express.Router();
import { categoryController } from "../../controllers/api/category-controller";
import authMiddleware from "../../middlewares/auth";

router.get("/", authMiddleware, categoryController.getAllCategories);

export default router;
