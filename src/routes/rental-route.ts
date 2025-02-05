import express from "express";
const router = express.Router();
import { rentalController } from "../controllers/rental-controller";
import authMiddleware from "../middlewares/auth";

router.get("/", authMiddleware, rentalController.getRentalsByRole);
// router.post("/create", authMiddleware, rentalController.createRental);

export default router;
