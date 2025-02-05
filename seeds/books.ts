import type { Knex } from "knex";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("books").del();

  // Inserts seed entries
  await knex("books").insert([
    {
      id: v4(),
      code_book: "A001",
      title: "Manga Dragn Ball Super",
      image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
      author: "Kishimoto",
      stock: 2,
      description: "Manga Dragn Ball Super wkwk",
      created_by: "admin",
    },
    {
      id: v4(),
      code_book: "A002",
      title: "Manga Naruto vol 2",
      image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
      author: "Kishimoto",
      stock: 3,
      description: "Manga Naruto wkwk",
      created_by: "admin",
    },
    {
      id: v4(),
      code_book: "A003",
      title: "Manga Dragn Ball vol 3",
      image: "https://cdn.myanimelist.net/images/manga/2/116087.jpg",
      author: "Kishimoto",
      stock: 0,
      description: "Manga Dragn Ball wkwk",
      created_by: "admin",
    },
  ]);
}
