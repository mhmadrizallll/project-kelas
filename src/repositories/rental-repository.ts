import { RentalModel } from "../../models/rental-model";
import { knexInstance as knex } from "../../config/knexInstance";

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

  async createRental(
    data: {
      id: string;
      user_id: string;
      fine: number;
      status: string;
      rental_date: Date;
      due_date: Date;
      return_date: Date | null;
    },
    bookIds: string[]
  ) {
    return knex.transaction(async (trx) => {
      // insert rental
      const [newRental] = await trx("rentals")
        .insert(data)
        .returning("*")
        .transacting(trx);

      // cek jika gak ada buku
      if (bookIds.length > 0) {
        // insert buku rental
        const bookRental = bookIds.map((bookId) => ({
          rental_id: newRental.id,
          book_id: bookId,
        }));

        await trx("rental_books").insert(bookRental).transacting(trx);
      }
    });
  }
}

const rentalRepository = new RentalRepository();

export { rentalRepository };
