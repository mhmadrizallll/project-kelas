import express, { Express } from "express";
const router = express.Router();
import { categoryController } from "../controllers/category-controller";

router.get("/", categoryController.getAllCategories);

export default router;
