import { categoryService } from "../services/category-service";
import express, { Request, Response } from "express";

class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    const categories = await categoryService.getAllCategories();
    res
      .status(200)
      .json({ status: true, message: "Data Categories", data: categories });
  }
}

const categoryController = new CategoryController();
export { categoryController };
