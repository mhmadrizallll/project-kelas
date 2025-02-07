import { RentalModel } from "../../models/rental-model";
import { knexInstance as knex } from "../../config/knexInstance";
import { v4 } from "uuid";

class RentalRepository {
  async getRentalsByRole(reqRole: string, userId: string) {
    return knex("rentals")
      .join("users", "rentals.user_id", "users.id")
      .leftJoin("rental_books", "rentals.id", "rental_books.rental_id")
      .leftJoin("books", "rental_books.book_id", "books.id")
      .where("users.role", reqRole) // ✅ Hanya berdasarkan role mereka
      .where("users.id", userId) // ✅ Hanya rental milik user yang login
      .select(
        "rentals.id as rental_id",
        "rentals.user_id",
        "rentals.status",
        "rentals.fine",
        "rentals.rental_date",
        "rentals.due_date",
        "rentals.return_date",
        "books.id as book_id",
        "books.code_book",
        "books.title",
        "books.image",
        "books.author",
        "books.stock",
        "books.description"
      );
  }
  // Create
  // cek bukuid tidak ada dalam book table
  // async checkBookIdNothingBookTable(bookIds: string[]) {
  //   return knex("books").whereNotIn("id", bookIds);
  // }
  // Cek apakah user sudah meminjam buku tertentu dan masih aktif
  async checkExistingRental(userId: string, bookIds: string[]) {
    return knex("rental_books")
      .join("rentals", "rental_books.rental_id", "rentals.id")
      .where("rentals.user_id", userId)
      .where("rentals.status", "borrowed")
      .whereIn("rental_books.book_id", bookIds)
      .select("rental_books.book_id", "rentals.status");
  }

  // Cek stok buku
  async checkBookStock(bookIds: string[]) {
    return knex("books").whereIn("id", bookIds);
  }

  // Buat rental baru
  async createRental(
    userId: string,
    bookIds: string[],
    rentalData: {
      id: string;
      user_id: string;
      status: string;
      fine: number;
      rental_date: Date;
      due_date: Date;
      return_date: Date | null;
    }
  ) {
    return await knex("rentals").insert(rentalData);
  }
  // Crate rental_books
  async createBookToRentalBooks(
    rentalData: {
      rental_id: string;
      book_id: string;
    }[],
    bookId: string[]
  ) {
    return knex("rental_books").insert(rentalData);
  }
  // Kurangi stock buku
  async updateDecrementBookStock(bookId: string[]) {
    return knex("books").whereIn("id", bookId).decrement("stock", 1);
  }

  // end create

  // Cek rental aktif berdasarkan rentalId dan userId
  async getActiveRentalById(rentalId: string, userId: string) {
    return knex("rentals")
      .where("id", rentalId)
      .where("user_id", userId)
      .where("status", "borrowed")
      .returning("*")
      .first();
  }

  // Ambil daftar buku dalam rental
  async getRentalBooks(rentalId: string) {
    return knex("rental_books").where("rental_id", rentalId).select("book_id");
  }

  // Update rental menjadi "returned" & set denda
  async updateRentalReturn(rentalId: string, fine: number) {
    return knex("rentals").where("id", rentalId).update({
      status: "returned",
      return_date: new Date(),
      fine: fine,
    });
  }

  // Tambah stok buku kembali
  async restoreBookStock(bookIds: string[]) {
    return knex("books").whereIn("id", bookIds).increment("stock", 1);
  }

  async getRentalAfterUpdate(rentalId: string) {
    return knex("rentals").where("id", rentalId).returning("*").first();
  }
}

const rentalRepository = new RentalRepository();

export { rentalRepository };
