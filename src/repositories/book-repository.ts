import { knexInstance } from "./../../config/knexInstance";
import { BookModel } from "../../models/book-model";

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
    id: string,
    data: {
      code_book: string;
      title: string;
      image: string;
      author: string;
      stock: number;
      description: string;
      created_by: string;
      updated_by: string;
    },
    categoryIds: string[]
  ) {
    return knexInstance.transaction(async (trx) => {
      // update buku
      const [updatedBook] = await trx("books")
        .where("id", id)
        .update(data)
        .returning("*")
        .transacting(trx);

      // cek jika ada kategori
      if (categoryIds.length > 0) {
        // delete kategori buku lama
        await trx("book_category").where("book_id", id).del().transacting(trx);

        // insert kategori buku baru
        const bookCategories = categoryIds.map((categoryId) => ({
          book_id: id,
          category_id: categoryId,
        }));

        await trx("book_category").insert(bookCategories).transacting(trx);
      }

      return updatedBook;
    });
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
