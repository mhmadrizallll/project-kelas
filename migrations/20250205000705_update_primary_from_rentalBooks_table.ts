import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rental_books", (table) => {
    table.primary(["rental_id", "book_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rental_books", (table) => {
    table.dropPrimary();
  });
}
