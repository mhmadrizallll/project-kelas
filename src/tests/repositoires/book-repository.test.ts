import { v4 } from "uuid";
import { BookModel } from "../../../models/book-model";
import { bookRepository } from "../../repositories/book-repository";
import { setupTestDB } from "../setupTestDB.test";
import { knexInstance as knex } from "../../../config/knexInstance";

// Panggil setupTestDB sekali di luar describe
setupTestDB();

// Helper untuk membuat buku
const createBook = async () => {
  return BookModel.query().insert({
    id: v4(), // Pastikan ID selalu unik
    code_book: "A002", // Bisa ganti sesuai kebutuhan untuk memastikan unik
    title: "Manga Naruto vol 2",
    image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
    author: "Kishimoto",
    description: "Naruto vol 2",
    stock: 3,
    is_deleted: false,
    created_by: "admin",
  });
};

describe("Book Repository", () => {
  // Hapus semua buku sebelum setiap test dimulai
  beforeEach(async () => {
    await BookModel.query().delete(); // Hapus semua buku
    await knex.raw("TRUNCATE TABLE books RESTART IDENTITY CASCADE"); // Jika ada foreign key
  });

  afterAll(async () => {
    await knex.destroy(); // Menutup koneksi database
  });

  test("should be defined", () => {
    expect(bookRepository).toBeDefined();
  });

  test("should get all books", async () => {
    await createBook(); // Insert a book
    const books = await bookRepository.getAllBooksWithCategories();
    expect(books).toBeDefined();
    expect(books.length).toBeGreaterThan(0);
  });

  test("should get book categories by id", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.getBookByIdWithCategories(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);
  });

  test("should get books where is_deleted is false", async () => {
    await createBook(); // Insert a book
    const books = await bookRepository.getAllBookIsDeletedFalse("admin");
    expect(books).toBeDefined();
    expect(books.length).toBeGreaterThan(0);
  });

  test("should ensure code_book is unique", async () => {
    await createBook(); // Insert first book

    // Harusnya saat cek code_book yang sama, hasilnya tidak null
    const duplicateCheck = await bookRepository.checkUniqueCodeBook("A002");
    expect(duplicateCheck).not.toBeNull(); // Harus menemukan buku dengan code_book ini

    // Insert buku dengan code yang sama seharusnya gagal
    await expect(createBook()).rejects.toThrow();
  });

  test("should create book", async () => {
    const newBook: any = {
      id: v4(), // Pastikan id baru
      code_book: "A010", // Gunakan code_book yang unik
      title: "Manga Naruto vol 10",
      image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
      author: "Kishimoto",
      description: "Naruto vol 10",
      stock: 5,
      is_deleted: false,
      created_by: "admin",
    };

    // Sekarang baru insert dengan bookRepository
    const createdBook = await bookRepository.createBooks(newBook);
    expect(createdBook).toBeDefined();
  });

  test("should create book category", async () => {
    // Pastikan kategori ada sebelum menjalankan test
    await knex("categories")
      .insert([
        { id: "1", name: "Fantasy" },
        { id: "2", name: "Action" },
      ])
      .onConflict("id")
      .ignore(); // Hindari duplikasi jika sudah ada

    const newBook: any = {
      id: v4(), // Pastikan ID unik
      code_book: "A010", // Gunakan code_book yang unik
      title: "Manga Naruto vol 10",
      image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
      author: "Kishimoto",
      description: "Naruto vol 10",
      stock: 5,
      is_deleted: false,
      created_by: "admin",
    };

    // Insert buku ke database
    const createdBook: any = await bookRepository.createBooks(newBook);

    // Pastikan book ID tersedia
    expect(createdBook).toBeDefined();
    expect(createdBook[0].id).toBe(newBook.id);

    // Definisikan kategori yang akan dihubungkan
    const categories = [
      { book_id: createdBook[0].id, category_id: "1" }, // ID harus ada di tabel categories
      { book_id: createdBook[0].id, category_id: "2" },
    ];

    // Insert kategori buku
    const createdCategory = await bookRepository.createCategoryBookCategory(
      categories,
      ["1", "2"]
    );

    // Pastikan kategori berhasil dibuat
    expect(createdCategory).toBeDefined();
  });

  test("should check book by id", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);
  });

  test("should get book categories", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const categories = await bookRepository.getBookCategories(bookid);
    expect(categories).toBeDefined();
  });

  test("should update book", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);

    const updatedBook = await bookRepository.updateBook(bookid, { ...book });
    expect(updatedBook).toBeDefined();
    expect(updatedBook[0].title).toBe("Manga Naruto vol 2");
  });

  test("should delete book category", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);

    const categories = await bookRepository.getBookCategories(bookid);
    expect(categories).toBeDefined();

    const deletedCategory = await bookRepository.deleteCategoryBookCategory(
      bookid
    );
    expect(deletedCategory).toBeDefined();
  });

  test("should insert category book category", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);

    const categories = await bookRepository.getBookCategories(bookid);
    expect(categories).toBeDefined();

    const insertedCategory = await bookRepository.insertCategoryBookCategory([
      {
        book_id: bookid,
        category_id: "1",
      },
      {
        book_id: bookid,
        category_id: "2",
      },
    ]);
    expect(insertedCategory).toBeDefined();
  });

  test("should soft delete book", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);

    const deletedBook = await bookRepository.softDeleteBookById(bookid, {
      deleted_by: "admin",
      restored_by: null,
    });
    expect(deletedBook).toBeDefined();
    expect(deletedBook?.is_deleted).toBe(true);
  });

  test("should restore book", async () => {
    const insertedBook = await createBook(); // Insert a book
    const bookid = insertedBook.id;
    const book = await bookRepository.chekBookById(bookid);
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookid);

    const restoredBook = await bookRepository.restoreBookById(bookid, {
      deleted_by: null,
      restored_by: "admin",
    });
    expect(restoredBook).toBeDefined();
    expect(restoredBook?.is_deleted).toBe(false);
  });
});
