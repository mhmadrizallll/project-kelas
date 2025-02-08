import { hashPassword, comparePassword } from "../../utils/bcrypt";

describe("bcrypt", () => {
  let hashedPassword: string;
  const password = "password";

  beforeAll(async () => {
    hashedPassword = await hashPassword(password);
  });

  describe("hashPassword", () => {
    describe("positive case", () => {
      test("hashPassword should return string", async () => {
        await expect(typeof hashedPassword).toBe("string");
        await expect(hashedPassword).not.toBe(password);
      });
    });
    describe("negative case", () => {
      test("invalid input empty params: should throw an error", async () => {
        await expect(hashPassword("")).rejects.toThrow(Error);
      });
      test("invalid input params number: should throw an error", async () => {
        await expect(hashPassword(123 as any)).rejects.toThrow(Error);
      });
    });
  });

  describe("comparePassword", () => {
    describe("positive case", () => {
      test("comparePassword should return true", async () => {
        const result = await comparePassword(password, hashedPassword);
        await expect(result).toBe(true);
      });
      test("any string and hashedPassword should return false", async () => {
        const result = await comparePassword("whatever", hashedPassword);
        await expect(result).toBe(false);
      });
    });
  });
});
