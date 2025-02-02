import express, { Express } from "express";
const router = express.Router();
import userRoute from "./user-route";
import bookRoute from "./book-route";
import categoryRoute from "./category-route";

router.use("/users", userRoute);
router.use("/books", bookRoute);
router.use("/category", categoryRoute);

export default router;
