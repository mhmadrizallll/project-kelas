import { Model, ModelObject } from "objection";
import { CategoryModel } from "./category-model";

export class BookModel extends Model {
  id!: string;
  code_book!: string;
  title!: string;
  image!: string;
  author!: string;
  stock!: number;
  description!: string;
  created_by!: string;

  static get tableName() {
    return "books";
  }

  static get relationMappings() {
    return {
      categories: {
        relation: Model.ManyToManyRelation,
        modelClass: CategoryModel,
        join: {
          from: "books.id",
          through: {
            from: "book_category.book_id",
            to: "book_category.category_id",
          },
          to: "categories.id",
        },
      },
    };
  }
}

export type Book = ModelObject<BookModel>;
