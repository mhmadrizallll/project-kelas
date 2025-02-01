import express, { Express } from "express";
const app: Express = express();
const port = process.env.PORT || 3000;
import knex from "knex";
import { Model } from "objection";

import router from "./src/routes";

const knexInstance = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1",
    database: "project-bootcamp",
  },
});

Model.knex(knexInstance);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
