import { v4 } from "uuid";
import { rentalRepository } from "../repositories/rental-repository";
import { knexInstance as knex } from "../../config/knexInstance";
import { AppError } from "../helpers/error";

class RentalService {
  async getAllRental(reqRole: string) {
    if (reqRole !== "admin") {
      throw new AppError(403, "You can't get all rental");
    }
    return await rentalRepository.getAllRental();
  }
  async getRentalsByRole(reqRole: string, userId: string) {
    const rentals = await rentalRepository.getRentalsByRole(reqRole, userId);
    // jika rental gak ada maka throw error
    if (rentals.length === 0) {
      throw new AppError(404, "Rental not found");
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
  }
  async createRental(userId: string, bookIds: string[]) {
    // Validasi apakah bookIds ada dan merupakan array yang tidak kosong
    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      throw new AppError(404, "You must provide at least one book to borrow.");
    }
    // Cek apakah user sudah meminjam buku yang sama
    const existingRentals = await rentalRepository.checkExistingRental(
      userId,
      bookIds
    );
    // console.log(existingRentals);
    if (existingRentals.length > 0) {
      throw new AppError(400, "You have already borrowed one of these books.");
    }

    // setiap rental_id hanya bisa meminjam 1 buku
    if (bookIds.length > 1) {
      throw new AppError(400, "hanya bisa pinjam 1 buku yahhh");
    }

    // cek jika bookid gak ada dalam book table
    // const book = await rentalRepository.checkBookIdNothingBookTable(bookIds);
    // if (book.length > 0) {
    //   throw new AppError(404, "Book not found, please choose another book.");
    // }

    // Cek stok buku dan validasi dengan menampilkan title buku
    const books = await rentalRepository.checkBookStock(bookIds);
    const outOfStock = books.filter((book) => book.stock <= 0);
    console.log(outOfStock);
    if (outOfStock.length > 0) {
      // throw error pake title buku
      throw new AppError(
        400,
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
  async returnRental(userId: string, rentalId: string) {
    // Cek apakah rental valid dan masih aktif
    const rental = await rentalRepository.getActiveRentalById(rentalId, userId);
    if (!rental) {
      throw new AppError(404, "Rental not found or already returned.");
    }

    // Ambil daftar buku yang dipinjam
    const rentalBooks = await rentalRepository.getRentalBooks(rentalId);
    const bookIds = rentalBooks.map((rb) => rb.book_id);

    // Hitung denda jika telat
    const dueDate = new Date(rental.due_date);
    const today = new Date();
    let fine = 0;

    if (today > dueDate) {
      const diffDays = Math.ceil(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      fine = diffDays * 2000; // Rp2.000 per hari keterlambatan
    }

    // Update rental jadi returned & simpan denda
    await rentalRepository.updateRentalReturn(rentalId, fine);

    // Tambahkan stok buku kembali
    await rentalRepository.restoreBookStock(bookIds);

    const updatedRental = await rentalRepository.getRentalAfterUpdate(rentalId);
    return updatedRental;
  }
}
const rentalService = new RentalService();
export { rentalService };
