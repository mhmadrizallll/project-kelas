import express, { Express } from "express";
const router = express.Router();
import { bookController } from "../controllers/book-controller";
import authMiddleware from "../middlewares/auth";

router.get("/", authMiddleware, bookController.getAllBooks);
router.get("/:id", authMiddleware, bookController.getBookById);
router.post("/create", authMiddleware, bookController.createBook);
router.put("/update/:id", authMiddleware, bookController.updateBook);
router.delete("/delete/:id", authMiddleware, bookController.deleteBook);
router.put("/restore/:id", authMiddleware, bookController.restoreBook);

export default router;
