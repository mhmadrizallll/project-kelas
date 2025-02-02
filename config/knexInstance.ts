import knex from "knex";
import config from "../knexfile";

export const knexInstance = knex(config.development);
