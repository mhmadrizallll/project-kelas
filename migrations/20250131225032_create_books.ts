import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("books", (table) => {
    table.string("id").primary();
    table.string("code_book").notNullable().unique();
    table.string("title").notNullable();
    table.string("image").notNullable();
    table.string("author").notNullable();
    table.integer("stock").notNullable();
    table.string("description").notNullable();
    table.string("created_by").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("books");
}
