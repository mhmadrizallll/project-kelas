import { knexInstance } from "./../../config/knexInstance";
import { BookModel } from "../../models/book-model";

class BookRepository {
  async getAllBooksWithCategories() {
    return await BookModel.query().withGraphFetched("categories");
  }

  async getBookByIdWithCategories(id: string) {
    return await BookModel.query().findById(id).withGraphFetched("categories");
  }

  async createBookWithCategories(
    data: {
      id: string;
      code_book: string;
      title: string;
      image: string;
      author: string;
      stock: number;
      description: string;
      created_by: string;
    },
    categoriesIds: string[]
  ) {
    return knexInstance.transaction(async (trx) => {
      // insert buku
      const [newBook] = await trx("books")
        .insert(data)
        .returning("*")
        .transacting(trx);

      // cek jika ada kategori
      if (categoriesIds.length > 0) {
        // insert kategori buku
        const bookCategories = categoriesIds.map((categoryId) => ({
          book_id: newBook.id,
          category_id: categoryId,
        }));

        await trx("book_category").insert(bookCategories).transacting(trx);
      }

      return newBook;
    });
  }

  async updateBookWithCategories(
    data: {
      id?: string;
      code_book?: string;
      title?: string;
      image?: string;
      author?: string;
      stock?: number;
      description?: string;
      created_by?: string;
    },
    categoriesIds: string[]
  ) {
    return knexInstance.transaction(async (trx) => {
      // update buku
      const [updatedBook] = await trx("books")
        .update(data)
        .where({ id: data.id })
        .returning("*")
        .transacting(trx);

      // cek jika ada kategori
      if (categoriesIds.length > 0) {
        // update kategori buku
        await trx("book_category")
          .where({ book_id: data.id })
          .delete()
          .transacting(trx);

        const bookCategories = categoriesIds.map((categoryId) => ({
          book_id: data.id,
          category_id: categoryId,
        }));

        await trx("book_category").insert(bookCategories).transacting(trx);
      }

      return updatedBook;
    });
  }
}

const bookRepository = new BookRepository();
export { bookRepository };
