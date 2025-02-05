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
    return knex("books").whereIn("id", bookIds).select("id", "title", "stock");
  }

  // Buat rental baru
  async createRental(userId: string, bookIds: string[]) {
    return knex.transaction(async (trx) => {
      const rentalData = {
        id: v4(),
        user_id: userId,
        fine: 0,
        status: "borrowed",
        rental_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari ke depan
        return_date: null,
      };

      // Insert rental ke tabel rentals
      await trx("rentals").insert(rentalData);

      // Insert buku ke rental_books
      const rentalBooks = bookIds.map((bookId) => ({
        rental_id: rentalData.id,
        book_id: bookId,
      }));
      await trx("rental_books").insert(rentalBooks);

      // Update stok buku (-1 untuk setiap buku yang dipinjam)
      await trx("books").whereIn("id", bookIds).decrement("stock", 1);

      return rentalData;
    });
  }
}

const rentalRepository = new RentalRepository();

export { rentalRepository };
