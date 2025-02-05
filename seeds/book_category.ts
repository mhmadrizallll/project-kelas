import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("book_category").del();

  // Inserts seed entries
  await knex("book_category").insert([
    {
      book_id: "10cf7e36-76f5-46c2-9f71-eb0e62717861",
      category_id: "6f7da5c5-8bb4-4d61-bb45-29fb2d0c2e54",
    },
    {
      book_id: "10cf7e36-76f5-46c2-9f71-eb0e62717861",
      category_id: "e09db69c-888c-46d9-acbf-621f21a40996",
    },
    {
      book_id: "866bc50d-3dd6-43c4-9242-c3124d9d31d9",
      category_id: "714d5371-deb3-4182-958c-1e22522c34d9",
    },
    {
      book_id: "bc09a903-7a1e-47c6-8c78-d77f9485f161",
      category_id: "d002f84a-610e-4cf5-aa80-315f1031f8d9",
    },
  ]);
}
