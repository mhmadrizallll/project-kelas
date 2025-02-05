import { stat } from "fs";
import { rentalService } from "../services/rental-service";

import express, { Request, Response } from "express";

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
  // async createRental(req: AuthRequest, res: Response) {
  //   try {
  //     const reqRole = req.user?.role;
  //     const reqId = req.user?.id;
  //     const data = req.body;
  //     console.log(reqRole, reqId);
  //     const newRental = await rentalService.createRental(
  //       reqRole!,
  //       reqId!,
  //       data
  //     );
  //     console.log("Debug newRental:", JSON.stringify(newRental, null, 2));
  //     res.status(200).json({
  //       status: true,
  //       message: "Data Rental Created",
  //       data: newRental,
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({ status: false, error: error.message });
  //   }
  // }
}

const rentalController = new RentalController();
export { rentalController };
