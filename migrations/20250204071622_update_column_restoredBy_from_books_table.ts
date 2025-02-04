import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.string("restored_by").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.dropColumn("restored_by");
  });
}
