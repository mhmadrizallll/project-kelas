import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rental_books").del();

  // Inserts seed entries
  await knex("rental_books").insert([
    {
      rental_id: "1675c66d-d133-4086-a970-85a464a927e6",
      book_id: "10cf7e36-76f5-46c2-9f71-eb0e62717861",
    },
  ]);
}
