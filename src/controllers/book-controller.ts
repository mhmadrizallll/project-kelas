import { bookService } from "../services/book-service";
import express, { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

class BookController {
  async getAllBooks(req: AuthRequest, res: Response) {
    try {
      const reqRole = req.user?.role;
      console.log(reqRole);
      const books = await bookService.getAllBooks(reqRole!);
      res.status(200).json({ status: true, message: "Data Book", data: books });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      console.log(reqRole);
      const book = await bookService.getBookById(reqRole!, id);
      res.status(200).json({ status: true, message: "Data Book", data: book });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createBook(req: AuthRequest, res: Response) {
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

      const reqRole = req.user?.role;

      const newBook = await bookService.createBook(reqRole!, {
        code_book,
        title,
        image,
        author,
        stock,
        description,
        created_by,
        category_ids,
      });

      res.status(200).json({
        status: true,
        message: "Data Book",
        data: { newBook, category_ids },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const reqRole = req.user?.role;
      console.log(reqRole);
      const updatedBook = await bookService.updateBookWithCategories(
        reqRole!,
        id,
        data
      );

      res.status(200).json({
        status: true,
        message: "Data Book updated",
        data: updatedBook,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      console.log(reqRole);
      const deletedBook = await bookService.deleteBook(reqRole!, id);
      res.status(200).json({
        status: true,
        message: "Data Book deleted",
        data: deletedBook,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async restoreBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      const restoredBook = await bookService.restoreBook(reqRole!, id);
      res.status(200).json({
        status: true,
        message: "Data Book restored",
        data: restoredBook,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

const bookController = new BookController();
export { bookController };
