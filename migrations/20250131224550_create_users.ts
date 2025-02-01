import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique;
    table.string("password").notNullable();
    table.enum("role", ["admin", "member"]).notNullable().defaultTo("member");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
