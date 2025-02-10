import { knexInstance as knex } from "../../config/knexInstance";
import { bookRepository } from "../repositories/book-repository";
import { v4 } from "uuid";
import { Book } from "../interfaces/book-interfaces";
import fs from "fs";
import path from "path";
import { AppError } from "../helpers/error";
class BookService {
  async getAllBooks(reqRole: string) {
    if (reqRole !== "admin") {
      const booksIsDeletedFalse = await bookRepository.getAllBookIsDeletedFalse(
        "member"
      );
      return booksIsDeletedFalse;
    } else {
      const books = await bookRepository.getAllBooksWithCategories();
      return books;
    }
  }

  async getBookById(reqRole: string, id: string) {
    if (reqRole !== "admin") {
      const book = await bookRepository.getBookByIdWithCategories(id);
      if (!book) throw new AppError(404, "Book not found");
      if (book.is_deleted) {
        throw new AppError(404, "Book is deleted");
      }
      return book;
    } else {
      const book = await bookRepository.getBookByIdWithCategories(id);
      // console.log(book);
      return book;
    }
  }

  async createBook(
    reqRole: string,
    data: { book: Book; category_ids: string[] }
  ) {
    try {
      if (!data.category_ids || data.category_ids.length === 0) {
        throw new AppError(400, "Category is required");
      }

      if (!data.book.title) {
        throw new AppError(400, "Title is required");
      }

      if (reqRole !== "admin") {
        throw new AppError(403, "You can't create book as member");
      }

      const exitingBook = await bookRepository.checkUniqueCodeBook(
        data.book.code_book
      );
      if (exitingBook)
        throw new AppError(
          400,
          `book already exist with code ${data.book.code_book}`
        );

      return knex.transaction(async (trx) => {
        const payload = {
          id: v4(),
          code_book: data.book.code_book,
          title: data.book.title,
          image: data.book.image,
          author: data.book.author,
          stock: data.book.stock,
          description: data.book.description,
          created_by: reqRole,
          updated_by: null,
          deleted_by: null,
          restored_by: null,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        };

        await bookRepository.createBooks(payload);

        if (data.category_ids.length > 0) {
          const bookCategories = data.category_ids.map((categoryId) => ({
            book_id: payload.id,
            category_id: categoryId,
          }));

          await bookRepository.createCategoryBookCategory(
            bookCategories,
            data.category_ids
          );
        }

        return payload;
      });
    } catch (error: any) {
      if (data.book.image) {
        const filePath = path.join(__dirname, `../public/${data.book.image}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      throw new Error(error.message);
    }
  }

  async updateBookWithCategories(
    reqRole: string,
    id: string,
    data: {
      book: Book;
      category_ids?: string | string[]; // Bisa string atau array
    }
  ) {
    if (reqRole !== "admin") {
      throw new AppError(403, "You can't update book as member");
    }

    const existingBook = await bookRepository.chekBookById(id);
    if (!existingBook) throw new AppError(404, "Book not found");

    // 🔹 **Hapus gambar lama jika ada gambar baru**
    if (data.book.image && existingBook.image) {
      fs.unlink(
        path.join(__dirname, `../public/${existingBook.image}`),
        (err) => {
          if (err) console.error("Failed to delete old image:", err);
        }
      );
    }

    return knex.transaction(async (trx) => {
      const payload = {
        ...existingBook, // Pakai data lama
        ...data.book, // Update data baru
        updated_by: reqRole,
        updated_at: new Date(),
      };

      await bookRepository.updateBook(id, payload);

      //  **Handle category_ids agar selalu array**
      let categoryIds: string[] = [];

      if (Array.isArray(data.category_ids)) {
        categoryIds = data.category_ids;
      } else if (typeof data.category_ids === "string") {
        categoryIds = [data.category_ids]; // Jika hanya satu kategori dikirim sebagai string
      }

      // **Gunakan kategori lama jika tidak ada input kategori baru**
      if (categoryIds.length === 0) {
        const existingCategories = await bookRepository.getBookCategories(id);
        categoryIds = existingCategories.map((cat) => cat.category_id);
      }

      // console.log("Final category_ids:", categoryIds); // Debugging

      // **Update kategori jika ada perubahan**
      if (categoryIds.length > 0) {
        await bookRepository.deleteCategoryBookCategory(id);
        const booksCategory = categoryIds.map((categoryId) => ({
          book_id: id,
          category_id: categoryId,
        }));

        await bookRepository.insertCategoryBookCategory(booksCategory);
      }
    });
  }

  async deleteBook(reqRole: string, id: string) {
    if (reqRole !== "admin") {
      throw new AppError(403, "You can't delete book as member");
    }

    const book = await bookRepository.getBookByIdWithCategories(id);
    if (!book) throw new AppError(404, "Book not found");
    if (book.is_deleted) {
      throw new AppError(404, "Book is deleted");
    }

    const payload = {
      deleted_by: reqRole,
      restored_by: null,
    };

    return await bookRepository.softDeleteBookById(id, payload);
  }

  async restoreBook(reqRole: string, id: string) {
    if (reqRole !== "admin") {
      throw new AppError(403, "You can't restore book as member");
    }

    const book = await bookRepository.getBookByIdWithCategories(id);
    if (!book) throw new AppError(404, "Book not found");
    if (!book.is_deleted) {
      throw new AppError(404, "Book is not deleted");
    }

    const payload = {
      deleted_by: null,
      restored_by: reqRole,
    };

    return await bookRepository.restoreBookById(id, payload);
  }
}

const bookService = new BookService();
export { bookService };
