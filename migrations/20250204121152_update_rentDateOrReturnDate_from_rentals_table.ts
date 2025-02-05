import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rentals", (table) => {
    table.timestamp("rental_date").defaultTo(knex.fn.now());
    table.timestamp("due_date").nullable();
    table.timestamp("return_date").nullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rentals", (table) => {
    table.dropColumn("rental_date");
    table.dropColumn("due_date");
    table.dropColumn("return_date");
  });
}
