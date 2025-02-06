import { knexInstance as knex } from "./../../config/knexInstance";
import { BookModel } from "../../models/book-model";

import { Book } from "../interfaces/book-interfaces";

class BookRepository {
  async getAllBooksWithCategories() {
    return await BookModel.query().withGraphFetched({
      categories: true,
      rentals: true,
    });
  }

  async getBookByIdWithCategories(id: string) {
    return await BookModel.query()
      .findById(id)
      .withGraphFetched({ categories: true, rentals: true });
  }

  async getAllBookIsDeletedFalse(role: string) {
    return await BookModel.query()
      .where("is_deleted", false)
      .withGraphFetched({ categories: true, rentals: true });
  }
  // Create Books
  // cek unique code book
  async checkUniqueCodeBook(codeBook: string) {
    return await BookModel.query().where("code_book", codeBook).first();
  }

  // create books
  async createBooks(dataBooks: Book) {
    return await knex("books").insert(dataBooks).returning("*");
  }

  // create category to book_category
  async createCategoryBookCategory(
    dataBookCategory: {
      book_id: string;
      category_id: string;
    }[],
    catetoryId: string[]
  ) {
    return await knex("book_category").insert(dataBookCategory).returning("*");
  }

  //  end create

  // update
  // cek data book ada atau tidak
  async chekBookById(id: string) {
    return await knex("books").where("id", id).first();
  }

  async getBookCategories(id: string) {
    return await knex("book_category").where("book_id", id);
  }
  // create Update Book
  async updateBook(id: string, data: Book) {
    return knex("books").where("id", id).update(data).returning("*");
  }

  //  delete category jika ada
  async deleteCategoryBookCategory(id: string) {
    return await knex("book_category").where("book_id", id).del();
  }

  // inser category jika ada
  async insertCategoryBookCategory(
    dataBookCategory: {
      book_id: string;
      category_id: string;
    }[]
  ) {
    return await knex("book_category").insert(dataBookCategory).returning("*");
  }

  async softDeleteBookById(
    id: string,
    data: { deleted_by: string; restored_by: string | null }
  ) {
    return await BookModel.query().patchAndFetchById(id, {
      is_deleted: true,
      deleted_by: data.deleted_by,
      restored_by: data.restored_by,
    });
  }

  async restoreBookById(
    id: string,
    data: { restored_by: string; deleted_by: string | null }
  ) {
    return await BookModel.query().patchAndFetchById(id, {
      is_deleted: false,
      restored_by: data.restored_by,
      deleted_by: data.deleted_by,
    });
  }
}

const bookRepository = new BookRepository();
export { bookRepository };
