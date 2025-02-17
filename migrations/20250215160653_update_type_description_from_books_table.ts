import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("books", (table) => {
    table.text("description").alter(); // Ubah tipe data jika diperlukan
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("books", (table) => {
    table.string("description").alter(); // Kembalikan ke tipe sebelumnya jika rollback
  });
}
