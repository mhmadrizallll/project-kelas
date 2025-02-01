import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("categories").del();

  // Inserts seed entries
  await knex("categories").insert([
    { id: v4(), name: "Action" },
    { id: v4(), name: "Adventure" },
    { id: v4(), name: "Comedy" },
    { id: v4(), name: "Drama" },
    { id: v4(), name: "Fantasy" },
    { id: v4(), name: "Horror" },
  ]);
}
