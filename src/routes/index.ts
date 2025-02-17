import express from "express";
const router = express.Router();
import userRoute from "./api/user-route";
import bookRoute from "./api/book-route";
import categoryRoute from "./api/category-route";
import rentalRoute from "./api/rental-route";
import indexRoute from "./ejs/index";

// api

router.use("/users", userRoute);
router.use("/books", bookRoute);
router.use("/category", categoryRoute);
router.use("/rentals", rentalRoute);

// ejs

router.use("/", indexRoute);

export default router;
