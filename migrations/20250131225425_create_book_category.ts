import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("book_category", (table) => {
    table.string("book_id").notNullable();
    table.string("category_id").notNullable();
    table.primary(["book_id", "category_id"]); // Composite primary key
    table.timestamps(true, true);

    // Foreign key constraints
    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
    table
      .foreign("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("book_category");
}
