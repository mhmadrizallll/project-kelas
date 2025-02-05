import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rental_books", (table) => {
    table.dropColumn("id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rental_books", (table) => {
    table.string("id").primary();
  });
}
