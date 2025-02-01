import { Model, ModelObject } from "objection";

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
}

export type Book = ModelObject<BookModel>;
