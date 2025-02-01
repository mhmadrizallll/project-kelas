import { Model, ModelObject } from "objection";

class CategoryModel extends Model {
  id!: string;
  name!: string;
  static get tableName() {
    return "categories";
  }
}

export type Category = ModelObject<CategoryModel>;
