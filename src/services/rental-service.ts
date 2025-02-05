import { v4 } from "uuid";
import { rentalRepository } from "../repositories/rental-repository";
import { knexInstance as knex } from "../../config/knexInstance";

class RentalService {
  async getRentalsByRole(reqRole: string, userId: string) {
    try {
      const rentals = await rentalRepository.getRentalsByRole(reqRole, userId);
      // jika rental gak ada maka throw error
      if (rentals.length === 0) {
        throw new Error("Rental not found");
      }
      // Transform hasil query menjadi struktur JSON yang lebih rapi
      const formattedRentals: any = {};

      rentals.forEach((rental) => {
        if (!formattedRentals[rental.rental_id]) {
          formattedRentals[rental.rental_id] = {
            rental_id: rental.rental_id,
            user_id: rental.user_id,
            status: rental.status,
            fine: rental.fine,
            rental_date: rental.rental_date,
            due_date: rental.due_date,
            return_date: rental.return_date,
            books: [],
          };
        }

        if (rental.book_id) {
          formattedRentals[rental.rental_id].books.push({
            id: rental.book_id,
            code_book: rental.code_book,
            title: rental.title,
            image: rental.image,
            author: rental.author,
            stock: rental.stock,
            description: rental.description,
          });
        }
      });

      return Object.values(formattedRentals);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async createRental(userId: string, bookIds: string[]) {
    // Cek apakah user sudah meminjam buku yang sama
    const existingRentals = await rentalRepository.checkExistingRental(
      userId,
      bookIds
    );
    // console.log(existingRentals);
    if (existingRentals.length > 0) {
      throw new Error("You have already borrowed one of these books.");
    }

    // Cek stok buku dan validasi dengan menampilkan title buku
    const books = await rentalRepository.checkBookStock(bookIds);
    const outOfStock = books.filter((book) => book.stock <= 0);
    console.log(outOfStock);
    if (outOfStock.length > 0) {
      // throw error pake title buku
      throw new Error(
        `Book ${outOfStock[0].title} is out of stock. Please choose another book.`
      );
    }
    // Buat rental
    return knex.transaction(async (trx) => {
      // kirim payloadnya
      const rentalData = {
        id: v4(),
        user_id: userId,
        fine: 0,
        status: "borrowed",
        rental_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari ke depan
        return_date: null,
      };

      await rentalRepository.createRental(userId, bookIds, rentalData);

      // inser book ke rental_books
      const rentalBooks = bookIds.map((bookId) => ({
        rental_id: rentalData.id,
        book_id: bookId,
      }));
      await rentalRepository.createBookToRentalBooks(rentalBooks, bookIds);

      // Update stock buku
      await rentalRepository.updateDecrementBookStock(bookIds);

      return rentalData;
    });
  }
}
const rentalService = new RentalService();
export { rentalService };
