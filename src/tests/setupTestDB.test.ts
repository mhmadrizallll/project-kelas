import knex from "knex";
import { Model } from "objection";
import knexConfig from "../../knexfile"; // Sesuaikan dengan path knexfile

let knexInstance: any;

export const setupTestDB = () => {
  beforeAll(async () => {
    knexInstance = knex(knexConfig.test); // Gunakan database test
    Model.knex(knexInstance);
  });

  afterEach(async () => {
    await knexInstance.raw("TRUNCATE TABLE books RESTART IDENTITY CASCADE");
    await knexInstance.raw(
      "TRUNCATE TABLE book_category RESTART IDENTITY CASCADE"
    );
  });

  afterAll(async () => {
    await knexInstance.destroy();
  });
};

describe("Setup Test Database", () => {
  test("should run the setup without errors", () => {
    expect(true).toBe(true); // Dummy test untuk memastikan Jest mengenali file ini
  });
});
