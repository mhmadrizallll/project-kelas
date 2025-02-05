import { Model, ModelObject } from "objection";
import { UserModel } from "./user-model";
import { BookModel } from "./book-model";

export class RentalModel extends Model {
  id!: string;
  user_id!: string;
  fine!: number;
  status!: string;
  rental_date!: Date | null;
  due_date!: Date | null;
  return_date!: Date | null;
  static get tableName() {
    return "rentals";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rentals.user_id",
          to: "users.id",
        },
      },
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "rentals.id",
          through: {
            from: "rental_books.rental_id",
            to: "rental_books.book_id",
          },
          to: "books.id",
        },
      },
    };
  }
}

export type Rental = ModelObject<RentalModel>;
