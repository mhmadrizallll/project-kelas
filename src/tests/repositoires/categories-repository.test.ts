import { categoryRepository } from "../../repositories/category-repository";
import { setupTestDB } from "../setupTestDB.test";

setupTestDB();

describe("Category Repository", () => {
  it("should be defined", () => {
    expect(categoryRepository).toBeDefined();
  });

  test("should get all categories with books", async () => {
    const categories = await categoryRepository.getAllCategoriesWithBooks();

    expect(categories).toBeInstanceOf(Array);
    expect(categories.length).toBeGreaterThan(0);
  });
});
