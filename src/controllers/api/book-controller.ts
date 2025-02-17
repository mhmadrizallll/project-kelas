import { Book } from "../../interfaces/book-interfaces";
import { bookService } from "../../services/book-service";
import { Request, Response } from "express";
import { AppError } from "../../helpers/error";

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
      // console.log(reqRole);
      const books = await bookService.getAllBooks(reqRole!);
      res.status(200).json({ status: true, message: "Data Book", data: books });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async getBookById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      // console.log(reqRole);
      const book = await bookService.getBookById(reqRole!, id);
      res.status(200).json({ status: true, message: "Data Book", data: book });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async createBook(req: AuthRequest, res: Response) {
    try {
      const payload: Partial<Book> = {
        code_book: req.body.code_book,
        title: req.body.title,
        image: req.body.image,
        author: req.body.author,
        stock: req.body.stock,
        description: req.body.description,
        created_by: req.body.created_by,
      };

      const data: { book: Book; category_ids: string[] } = {
        book: payload as Book,
        category_ids: req.body.category_ids,
      };

      const reqRole = req.user?.role;

      const newBook = await bookService.createBook(reqRole!, data);

      res.status(201).json({
        status: true,
        message: "Data Book",
        data: { newBook },
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async updateBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const payload: Partial<Book> = {
        code_book: req.body.code_book,
        title: req.body.title,
        image: req.body.image,
        author: req.body.author,
        stock: req.body.stock,
        description: req.body.description,
        created_by: req.body.created_by,
      };

      const data: { book: Book; category_ids: string[] } = {
        book: payload as Book,
        category_ids: req.body.category_ids,
      };
      const reqRole = req.user?.role;
      // console.log(reqRole);
      await bookService.updateBookWithCategories(reqRole!, id, data);

      const book = await bookService.getBookById(reqRole!, id);

      res.status(200).json({
        status: true,
        message: "Data Book updated",
        data: book,
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async deleteBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      // console.log(reqRole);
      const deletedBook = await bookService.deleteBook(reqRole!, id);
      res.status(200).json({
        status: true,
        message: "Data Book deleted",
        data: deletedBook,
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
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
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  // async uploadImage(req: Request, res: Response) {
  //   const url = `/uploads/${req.file?.filename}`;
  //   res.status(200).json({ message: "Image uploaded", data: url });
  // }
}

const bookController = new BookController();
export { bookController };
