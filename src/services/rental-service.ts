import { v4 } from "uuid";
import { rentalRepository } from "../repositories/rental-repository";

class RentalService {
  async createRental(
    reqRole: string,
    reqId: string,
    data: {
      id: string;
      user_id: string;
      fine: number;
      status: string;
      rental_date: Date;
      due_date: Date;
      return_date: Date | null;
      books_ids: string[];
    }
  ) {
    try {
      // jika member dan bukan diri sendiri maka tidak bisa
      //   if (reqRole === "member" && data.user_id !== reqId) {
      //     throw new Error("You can't create rental as member for other user");
      //   }
      const rentaldata = {
        id: v4(),
        user_id: reqId,
        fine: 0,
        status: "borrowed",
        rental_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        return_date: null,
      };
      const newRental = await rentalRepository.createRental(
        rentaldata,
        data.books_ids
      );
      return newRental;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
const rentalService = new RentalService();
export { rentalService };
