import express from "express";
const router = express.Router();
import { bookController } from "../../controllers/ejs/book-controller";
import { userController } from "../../controllers/ejs/user-controller";

router.get("/", bookController.getAllBooks);
router.get("/login", userController.loginForm);
router.post("/login", userController.login);

export default router;
