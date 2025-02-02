import express, { Express } from "express";
const router = express.Router();
import { bookController } from "../controllers/book-controller";

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/create", bookController.createBook);
// router.put("/update/:id", bookController.updateBook);

export default router;
