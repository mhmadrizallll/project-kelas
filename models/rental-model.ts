import { Model, ModelObject } from "objection";

export class RentalModel extends Model {
  id!: string;
  book_id!: string;
  user_id!: string;
  rental_date!: Date;
  return_date!: Date;
  static get tableName() {
    return "rentals";
  }
}

export type Rental = ModelObject<RentalModel>;
