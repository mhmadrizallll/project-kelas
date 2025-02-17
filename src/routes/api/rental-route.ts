import express from "express";
const router = express.Router();
import { rentalController } from "../../controllers/api/rental-controller";
import authMiddleware from "../../middlewares/auth";

router.get("/", authMiddleware, rentalController.getRentalsByRole);
router.post("/create", authMiddleware, rentalController.createRental);
router.put("/return", authMiddleware, rentalController.returnRental);

export default router;
