import { RentalModel } from "./rental-model";
import { Model, ModelObject } from "objection";

export class UserModel extends Model {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: string;
  is_deleted!: boolean;
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      rentals: {
        relation: Model.HasManyRelation,
        modelClass: RentalModel,
        join: {
          from: "users.id",
          to: "rentals.user_id",
        },
      },
    };
  }
}

export type User = ModelObject<UserModel>;
