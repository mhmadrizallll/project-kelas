import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.string("updated_by").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("books", (table) => {
    table.dropColumn("updated_by");
  });
}
