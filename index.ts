import express, { Express } from "express";
const app: Express = express();
const port = process.env.PORT || 3000;
import { knexInstance } from "./config/knexInstance";
import { Model } from "objection";

import router from "./src/routes";

Model.knex(knexInstance);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
