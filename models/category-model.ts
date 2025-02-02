import { Model, ModelObject } from "objection";
import { BookModel } from "./book-model";

export class CategoryModel extends Model {
  id!: string;
  name!: string;
  static get tableName() {
    return "categories";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "categories.id",
          through: {
            from: "book_category.category_id",
            to: "book_category.book_id",
          },
          to: "books.id",
        },
      },
    };
  }
}

export type Category = ModelObject<CategoryModel>;
