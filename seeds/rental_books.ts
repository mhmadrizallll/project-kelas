import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rental_books").del();

  // Inserts seed entries
  await knex("rental_books").insert([
    {
      id: v4(),
      rental_id: "deb2c3bf-b4c6-4f67-a6cc-5446d576d5b8",
      book_id: "f43c07d0-8563-40fc-b71e-b9b1375a4a31",
    },
  ]);
}
