import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rentals").del();

  // Inserts seed entries
  await knex("rentals").insert([
    {
      id: v4(),
      user_id: "a5989a43-4dc8-4842-98b7-f85f19c4784e",
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
