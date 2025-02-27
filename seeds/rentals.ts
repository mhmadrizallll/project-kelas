import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rentals").del();

  // Inserts seed entries
  await knex("rentals").insert([
    {
      id: v4(),
      user_id: "cbbf781f-6b24-4e64-bce7-fe6123d034d9",
      created_at: new Date(),
      updated_at: new Date(),
      fine: 0,
      status: "borrowed",
      rental_date: new Date(),
      due_date: new Date(),
      return_date: new Date(),
    },
  ]);
}
