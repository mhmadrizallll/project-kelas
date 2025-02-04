import { title } from "process";
import { bookRepository } from "../repositories/book-repository";
import { v4 } from "uuid";
class BookService {
  async getAllBooks(reqRole: string) {
    try {
      if (reqRole !== "admin") {
        const booksIsDeletedFalse =
          await bookRepository.getAllBookIsDeletedFalse("member");
        return booksIsDeletedFalse;
      } else {
        const books = await bookRepository.getAllBooksWithCategories();
        return books;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBookById(reqRole: string, id: string) {
    try {
      if (reqRole !== "admin") {
        const book = await bookRepository.getBookByIdWithCategories(id);
        if (!book) throw new Error("Book not found");
        if (book.is_deleted) {
          throw new Error("Book is deleted");
        }
        return book;
      } else {
        const book = await bookRepository.getBookByIdWithCategories(id);
        // console.log(book);
        return book;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createBook(
    reqRole: string,
    data: {
      code_book: string;
      title: string;
      image: string;
      author: string;
      stock: number;
      description: string;
      created_by: string;
      category_ids: string[];
    }
  ) {
    try {
      if (!data.category_ids || data.category_ids.length === 0) {
        throw new Error("Category is required");
      }

      if (reqRole !== "admin") {
        throw new Error("You can't create book as member");
      }

      const bookData = {
        id: v4(),
        code_book: data.code_book,
        title: data.title,
        image: data.image,
        author: data.author,
        stock: data.stock,
        description: data.description,
        created_by: reqRole,
      };

      return await bookRepository.createBookWithCategories(
        bookData,
        data.category_ids
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateBookWithCategories(
    reqRole: string,
    id: string,
    data: {
      code_book: string;
      title: string;
      image: string;
      author: string;
      stock: number;
      description: string;
      created_by: string;
      category_ids: string[];
    }
  ) {
    try {
      if (!data.category_ids || data.category_ids.length === 0) {
        throw new Error("Category is required");
      }

      if (reqRole !== "admin") {
        throw new Error("You can't update book as member");
      }

      const bookData = {
        code_book: data.code_book,
        title: data.title,
        image: data.image,
        author: data.author,
        stock: data.stock,
        description: data.description,
        created_by: data.created_by,
        updated_by: reqRole,
      };

      return await bookRepository.updateBookWithCategories(
        id,
        bookData,
        data.category_ids
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteBook(reqRole: string, id: string) {
    try {
      if (reqRole !== "admin") {
        throw new Error("You can't delete book as member");
      }

      const book = await bookRepository.getBookByIdWithCategories(id);
      if (!book) throw new Error("Book not found");
      if (book.is_deleted) {
        throw new Error("Book is deleted");
      }

      const payload = {
        deleted_by: reqRole,
        restored_by: null,
      };

      return await bookRepository.softDeleteBookById(id, payload);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async restoreBook(reqRole: string, id: string) {
    try {
      if (reqRole !== "admin") {
        throw new Error("You can't restore book as member");
      }

      const book = await bookRepository.getBookByIdWithCategories(id);
      if (!book) throw new Error("Book not found");
      if (!book.is_deleted) {
        throw new Error("Book is not deleted");
      }

      const payload = {
        deleted_by: null,
        restored_by: reqRole,
      };

      return await bookRepository.restoreBookById(id, payload);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const bookService = new BookService();
export { bookService };
