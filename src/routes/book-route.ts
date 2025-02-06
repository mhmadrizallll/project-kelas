import express, { Express } from "express";
const router = express.Router();
import { bookController } from "../controllers/book-controller";
import authMiddleware from "../middlewares/auth";
import { uploadImage } from "../middlewares/upload-image";
import { uploadImageUpdate } from "../middlewares/upload-image-update";

router.get("/", authMiddleware, bookController.getAllBooks);
router.get("/:id", authMiddleware, bookController.getBookById);
router.post("/create", authMiddleware, uploadImage, bookController.createBook);
router.put(
  "/update/:id",
  authMiddleware,
  uploadImageUpdate,
  bookController.updateBook
);
router.delete("/delete/:id", authMiddleware, bookController.deleteBook);
router.put("/restore/:id", authMiddleware, bookController.restoreBook);
// router.post("/upload/image", uploadImage, (req, res) => {
//   res.status(200).json({ message: "Image uploaded" });
// });

export default router;
