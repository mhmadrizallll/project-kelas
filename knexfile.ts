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
  },
};

module.exports = config;
