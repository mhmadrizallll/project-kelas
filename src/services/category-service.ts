import { categoryRepository } from "../repositories/category-repository";

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.getAllCategoriesWithBooks();
  }
}

const categoryService = new CategoryService();
export { categoryService };
