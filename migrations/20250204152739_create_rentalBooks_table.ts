import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("rental_books", (table) => {
    table.string("id").primary();
    table.string("rental_id").notNullable();
    table.string("book_id").notNullable();
    table.timestamps(true, true);

    table
      .foreign("rental_id")
      .references("id")
      .inTable("rentals")
      .onDelete("CASCADE");
    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("rental_books");
}
