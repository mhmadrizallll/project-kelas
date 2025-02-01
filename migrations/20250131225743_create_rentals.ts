import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("rentals", (table) => {
    table.string("id").primary();
    table.string("book_id").notNullable();
    table.string("user_id").notNullable();
    table.date("rental_date").notNullable();
    table.date("return_date").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("rentals");
}
