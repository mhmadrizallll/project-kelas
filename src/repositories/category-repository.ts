import { CategoryModel } from "../../models/category-model";

class CategoryRepository {
  async getAllCategoriesWithBooks() {
    return CategoryModel.query().withGraphFetched("books");
  }
}

const categoryRepository = new CategoryRepository();
export { categoryRepository };
