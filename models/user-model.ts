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
}

export type User = ModelObject<UserModel>;
