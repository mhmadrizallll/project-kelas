import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rentals", (table) => {
    // ubah date ke timestamp dan bikin nullable
    table.dropColumn("rental_date");
    table.dropColumn("return_date");
    // remove book_id
    table.dropColumn("book_id");
    table.decimal("fine", 10, 2).defaultTo(0);
    table.enu("status", ["borrowed", "returned", "late"]).defaultTo("borrowed");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rentals", (table) => {
    table.date("rental_date").notNullable();
    table.date("return_date").notNullable();
    table.string("book_id").notNullable();
    table.dropColumn("fine");
    table.dropColumn("status");
  });
}
