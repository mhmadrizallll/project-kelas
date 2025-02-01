import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("book_category", (table) => {
    table.string("id").primary();
    table.string("book_id").notNullable();
    table.string("category_id").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("book_category");
}
