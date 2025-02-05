import { v4 } from "uuid";
import { rentalRepository } from "../repositories/rental-repository";

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
  // async createRental(
  //   reqRole: string,
  //   reqId: string,
  //   data: {
  //     id: string;
  //     user_id: string;
  //     fine: number;
  //     status: string;
  //     rental_date: Date;
  //     due_date: Date;
  //     return_date: Date | null;
  //     books_ids: string[];
  //   }
  // ) {
  //   try {
  //     // Cek apakah user sudah meminjam salah satu buku yang sama dan masih aktif
  //     const activeRentals = await rentalRepository.getUserActiveById(reqId);
  //     const rentedBookIds = activeRentals.flatMap((rental) => rental.books_ids);

  //     const duplicateBooks = data.books_ids.filter((bookId) =>
  //       rentedBookIds.includes(bookId)
  //     );

  //     console.log(duplicateBooks);

  //     if (duplicateBooks.length > 0) {
  //       throw new Error(
  //         `You already rented these books: ${duplicateBooks.join(", ")}`
  //       );
  //     }
  //     // jika member dan bukan diri sendiri maka tidak bisa
  //     //   if (reqRole === "member" && data.user_id !== reqId) {
  //     //     throw new Error("You can't create rental as member for other user");
  //     //   }
  //     const rentaldata = {
  //       id: v4(),
  //       user_id: reqId,
  //       fine: 0,
  //       status: "borrowed",
  //       rental_date: new Date(),
  //       due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  //       return_date: null,
  //     };
  //     const newRental = await rentalRepository.createRental(
  //       rentaldata,
  //       data.books_ids
  //     );
  //     return newRental;
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
}
const rentalService = new RentalService();
export { rentalService };
