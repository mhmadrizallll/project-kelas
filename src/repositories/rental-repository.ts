import { RentalModel } from "../../models/rental-model";
import { knexInstance as knex } from "../../config/knexInstance";

class RentalRepository {
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
