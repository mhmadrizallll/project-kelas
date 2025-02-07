import { stat } from "fs";
import { rentalService } from "../services/rental-service";

import express, { Request, Response } from "express";
import { AppError } from "../utils/error";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

class RentalController {
  async getRentalsByRole(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id; // Ambil ID user dari middleware auth
      const reqRole = req.user?.role; // Ambil role user
      // console.log(reqRole);
      const rentals = await rentalService.getRentalsByRole(reqRole!, userId!);

      res.status(200).json({
        status: true,
        message: "Rentals Data successfully",
        data: rentals,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async createRental(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id!;
      const { books_ids } = req.body;
      // console.log(userId);

      const newRental = await rentalService.createRental(userId, books_ids);
      res.status(201).json({
        status: true,
        message: "Rental created successfully",
        data: { rental_id: newRental },
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async returnRental(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id!;
      const { rental_id } = req.body;

      const result = await rentalService.returnRental(userId, rental_id);
      // console.log(result, "result nya ahgaghagaga");
      res.status(200).json({
        status: true,
        message: "Rental returned successfully",
        data: result,
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }
}

const rentalController = new RentalController();
export { rentalController };
