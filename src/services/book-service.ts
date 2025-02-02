import { bookRepository } from "../repositories/book-repository";
import { v4 } from "uuid";
class BookService {
  async getAllBooks() {
    return await bookRepository.getAllBooksWithCategories();
  }

  async getBookById(id: string) {
    return await bookRepository.getBookByIdWithCategories(id);
  }

  async createBook(data: {
    code_book: string;
    title: string;
    image: string;
    author: string;
    stock: number;
    description: string;
    created_by: string;
    category_ids: string[];
  }) {
    if (!data.category_ids || data.category_ids.length === 0) {
      throw new Error("Category is required");
    }

    const bookData = {
      id: v4(),
      code_book: data.code_book,
      title: data.title,
      image: data.image,
      author: data.author,
      stock: data.stock,
      description: data.description,
      created_by: data.created_by,
    };

    return await bookRepository.createBookWithCategories(
      bookData,
      data.category_ids
    );
  }
}

const bookService = new BookService();
export { bookService };
