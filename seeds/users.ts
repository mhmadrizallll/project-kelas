import type { Knex } from "knex";
import { v4 } from "uuid";
import { hashPassword } from "../src/utils/bcrypt.ts";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: v4(),
      name: "admin",
      email: "admin@gmail.com",
      password: await hashPassword("admin"),
      role: "admin",
      is_deleted: false,
    },
    {
      id: v4(),
      name: "member",
      email: "member@gmail.com",
      password: await hashPassword("member"),
      role: "member",
      is_deleted: false,
    },
  ]);
}
