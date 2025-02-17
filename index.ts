import express, { Express } from "express";
const app: Express = express();
const port = process.env.PORT || 3000;
import { knexInstance } from "./config/knexInstance";
import { Model } from "objection";
import path from "path";

import router from "./src/routes";
import cors from "cors";

Model.knex(knexInstance);

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/v1", router);
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

export default app;
