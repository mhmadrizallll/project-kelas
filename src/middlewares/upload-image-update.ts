import express, { Request, Response, NextFunction } from "express";
import { upload } from "./upload-handler";

export const uploadImageUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    next();
  });
};
