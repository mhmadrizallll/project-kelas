import { v4 } from "uuid";
import { userRepository } from "../../repositories/user-repository";
import { setupTestDB } from "../setupTestDB.test";

setupTestDB();

describe("User Repository", () => {
  it("should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  test("should get all users", async () => {
    const users = await userRepository.getAllUsers();
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
  });

  test("should get user by role", async () => {
    const users = await userRepository.getUserByRole("admin");
    expect(users).toBeInstanceOf(Array);
  });

  test("should get user by id", async () => {
    const user = await userRepository.getUserById(
      "e3365bc1-3dc0-4df1-9a69-5515214bd730"
    );
    // expect(user).rejects.toThrow("User not found");
    expect(user).not.toBe(null);
  });

  test("should throw an error if user is not found", async () => {
    await expect(userRepository.getUserById("non-existent-id")).rejects.toThrow(
      "User not found"
    );
  });

  test("should get user by email", async () => {
    await expect(
      userRepository.getUserByEmail("notfound@example.com")
    ).rejects.toThrow("User not found");

    const user = await userRepository.getUserByEmail("test@example.com");
    expect(user).not.toBe(null);
  });

  test("should create user", async () => {
    const createdUser: any = {
      id: v4(),
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      role: "admin",
      is_deleted: false,
    };
    const user = await userRepository.createUser(createdUser);
    expect(user).not.toBe(null);
  });

  test("should update user by id ", async () => {
    const updatedUser: any = {
      id: "e3365bc1-3dc0-4df1-9a69-5515214bd730",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      role: "admin",
      is_deleted: false,
    };
    const user = await userRepository.updateUserById(
      updatedUser.id,
      updatedUser
    );
    expect(user).not.toBe(null);
  });

  test("should soft delete user by id ", async () => {
    const user = await userRepository.softDeleteUserById(
      "e3365bc1-3dc0-4df1-9a69-5515214bd730"
    );
    expect(user).not.toBe(null);
  });

  test("should restore user by id ", async () => {
    const user = await userRepository.restoreUserById(
      "e3365bc1-3dc0-4df1-9a69-5515214bd730"
    );
    expect(user).not.toBe(null);
  });
});
