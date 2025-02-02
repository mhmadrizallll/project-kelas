import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("book_category").del();

  // Inserts seed entries
  await knex("book_category").insert([
    {
      id: v4(),
      book_id: "1473c0f3-dfe8-48da-a0a3-6ce9f6d5c265",
      category_id: "0f9a17c9-906a-4465-b81f-2bbcd9553589",
    },
  ]);
}
