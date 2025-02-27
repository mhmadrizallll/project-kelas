import { Model, ModelObject } from "objection";
import { CategoryModel } from "./category-model";
import { RentalModel } from "./rental-model";

export class BookModel extends Model {
  id!: string;
  code_book!: string;
  title!: string;
  image!: string;
  author!: string;
  stock!: number;
  description!: string;
  created_by!: string;
  is_deleted!: boolean;
  updated_by!: string | null;
  deleted_by!: string | null;
  restored_by!: string | null;

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
      rentals: {
        relation: Model.ManyToManyRelation,
        modelClass: RentalModel,
        join: {
          from: "books.id",
          through: {
            from: "rental_books.book_id",
            to: "rental_books.rental_id",
          },
          to: "rentals.id",
        },
      },
    };
  }
}

export type Book = ModelObject<BookModel>;
