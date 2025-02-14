import { rentalRepository } from "../../repositories/rental-repository";
import { setupTestDB } from "../setupTestDB.test";
import { UserModel } from "../../../models/user-model";
import { BookModel } from "../../../models/book-model";
import { v4 } from "uuid";

setupTestDB();
interface BookData {
  code_book?: string;
  title?: string;
  image?: string;
  author?: string;
  description?: string;
  stock?: number;
  created_by?: string;
}
const createUser = async () => {
  return await UserModel.query().insert({
    id: v4(),
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
  });
};

const createBook = async (bookData: BookData = {}) => {
  return BookModel.query().insert({
    id: v4(),
    code_book: `A${Math.floor(Math.random() * 10000)}`,
    title: bookData.title || "Default Book Title",
    image: bookData.image || "https://example.com/default.jpg",
    author: bookData.author || "Unknown Author",
    description: bookData.description || "Default description",
    stock: bookData.stock || 5,
    is_deleted: false,
    created_by: bookData.created_by || "admin",
  });
};

describe("Rental Repository", () => {
  it("should be defined", async () => {
    await expect(rentalRepository).toBeDefined();
  });

  test("Should get rental by role", async () => {
    const rentals = await rentalRepository.getRentalsByRole("admin", "1");
    expect(rentals).toBeInstanceOf(Array);
  });

  test("should check if rental exists", async () => {
    const result = await rentalRepository.checkExistingRental("1", ["1", "2"]);
    expect(result).toBeInstanceOf(Array);
  });

  test("should check book stock", async () => {
    const result = await rentalRepository.checkBookStock(["1", "2"]);
    expect(result).toBeInstanceOf(Array);
  });

  test("should create rental", async () => {
    const user = await createUser(); // Buat user dulu
    const book1 = await createBook({ title: "Book 1" });
    const book2 = await createBook({ title: "Book 2" });

    const rentalData = {
      id: v4(),
      user_id: user.id, // Sesuai parameter pertama (userId)
      status: "borrowed",
      fine: 0,
      rental_date: new Date(),
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
      return_date: null,
    };

    const bookIds = [book1.id, book2.id]; // Sesuai parameter kedua (bookIds)

    // Panggilan yang benar: Masukkan `user.id`, `bookIds`, dan `rentalData`
    const createdRental = await rentalRepository.createRental(
      user.id,
      bookIds,
      rentalData
    );

    expect(createdRental).toBeDefined();
  });

  test("should create book to rental book", async () => {
    // 1️ Create a user
    const user = await createUser();
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();

    // 2️ Create a book
    const book = await createBook();
    expect(book).toBeDefined();
    expect(book.id).toBeDefined();

    // 3️ Create a rental
    const newRental: any = await rentalRepository.createRental(
      user.id,
      [book.id],
      {
        id: v4(), // Ensure a valid UUID is generated
        user_id: user.id,
        status: "borrowed",
        fine: 0,
        rental_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        return_date: null,
      }
    );

    // 4️ Verify the rental was created successfully
    expect(newRental).toBeDefined();
    // expect(newRental.id).toBeDefined();

    // 5️ Create a new book to add to the rental
    const newBook = await createBook();
    expect(newBook).toBeDefined();
    expect(newBook.id).toBeDefined();

    // 6️ Prepare rentalData
    const rentalData = [
      {
        rental_id: newRental.id || "e1d08588-2c17-48cb-aba1-dd69323c8231", // Ensure this is not null
        book_id: newBook.id, // Ensure this is not null
      },
    ];

    // 7️ Add the book to rental_books
    const rentalBook = await rentalRepository.createBookToRentalBooks(
      rentalData,
      [newBook.id]
    );

    // 8️ Verify the book was added to rental_books
    expect(rentalBook).toBeDefined();
  });

  test("should update decrement rental", async () => {
    const decrementBook = await rentalRepository.updateDecrementBookStock([
      "1",
      "2",
    ]);
    expect(decrementBook).toBe(0);
  });

  test("should get active rental by id", async () => {
    const activeRental = await rentalRepository.getActiveRentalById(
      "0266ba8d-92a8-4ade-ae4c-95fdb8b4e3e8",
      "e3365bc1-3dc0-4df1-9a69-5515214bd730"
    );
    expect(activeRental).not.toBe(null);
  });

  test("should get rental books", async () => {
    const rentals = await rentalRepository.getRentalBooks(
      "0266ba8d-92a8-4ade-ae4c-95fdb8b4e3e8"
    );

    expect(rentals).toBeInstanceOf(Array);
  });

  test("should update rental return", async () => {
    const rentalId = "0266ba8d-92a8-4ade-ae4c-95fdb8b4e3e8";
    const fine = 1000;
    const updatedRental = await rentalRepository.updateRentalReturn(
      rentalId,
      fine
    );
    expect(updatedRental).toBe(1);
  });

  test("should restore book stock", async () => {
    const bookId = "0266ba8d-92a8-4ade-ae4c-95fdb8b4e3e8";
    const updatedRental = await rentalRepository.restoreBookStock([bookId]);
    expect(updatedRental).toBe(0);
  });

  test("should get rental after update", async () => {
    const rentalId = "0266ba8d-92a8-4ade-ae4c-95fdb8b4e3e8";
    const updatedRental = await rentalRepository.getRentalAfterUpdate(rentalId);
    expect(updatedRental).not.toBe(null);
  });
});
