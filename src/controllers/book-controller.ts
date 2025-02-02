import { bookService } from "../services/book-service";
import express, { Request, Response } from "express";

class BookController {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks();
      res
        .status(200)
        .json({ status: true, message: "Data Books", data: books });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      res.status(200).json({ status: true, message: "Data Book", data: book });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      const {
        code_book,
        title,
        image,
        author,
        stock,
        description,
        created_by,
        category_ids,
      } = req.body;

      const newBook = await bookService.createBook({
        code_book,
        title,
        image,
        author,
        stock,
        description,
        created_by,
        category_ids,
      });

      res
        .status(200)
        .json({ status: true, message: "Data Book", data: newBook });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

const bookController = new BookController();
export { bookController };
