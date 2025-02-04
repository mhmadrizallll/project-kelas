import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.boolean("is_deleted").defaultTo(false).after("description");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.dropColumn("is_deleted");
  });
}
