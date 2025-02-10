import express, { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../helpers/error";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token);
    if (!token) {
      res.status(401).json({ status: false, message: "Unauthorized" });
      return;
    }

    const user = verifyToken(token);
    req.user = user;
    // console.log("ini adalah token dari roleeee", user);
    next();
  } catch (error: any) {
    res.status(401).json({ status: false, message: error.message });
  }
};

export default authMiddleware;
