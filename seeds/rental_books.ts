import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rental_books").del();

  // Inserts seed entries
  await knex("rental_books").insert([
    {
      rental_id: "b1446380-9d91-49f0-890d-3257b14271b9",
      book_id: "f18f241d-16d1-439a-bee6-292ad850ab0b",
    },
  ]);
}
