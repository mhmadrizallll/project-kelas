// knexfile.ts
import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      user: "postgres",
      password: "1",
      database: "project-bootcamp",
      host: "localhost",
      port: 5432,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  test: {
    // Ubah dari "testing" ke "test"
    client: "pg",
    connection: {
      user: "postgres",
      password: "1",
      database: "project-bootcamp", // Pastikan database terpisah untuk testing
      host: "localhost",
      port: 5432,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

export default config;
